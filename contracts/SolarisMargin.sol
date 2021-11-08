// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {FlashLoanReceiverBase} from "./helpers/FlashLoanReceiverBase.sol";
import {UbeswapBase} from "./helpers/UbeswapBase.sol";
import {ILendingPoolAddressesProvider} from "./interfaces/ILendingPoolAddressesProvider.sol";
import {IUniswapV2Router02} from "./interfaces/IUniswapV2Router02.sol";
import {IProtocolDataProvider} from "./interfaces/IProtocolDataProvider.sol";
import {IStableDebtToken} from "./interfaces/IStableDebtToken.sol";

/// @title Solaris margin trading contract
/// @author Kirill Madorin
/// @notice You can use this contract to open leveraged positions using Moola flashloans and Ubeswap
/// @custom:experimental This is an experimental contract.

contract SolarisMargin is FlashLoanReceiverBase, UbeswapBase {
    using SafeMath for uint256;
    string private _name = "Solaris Margin";

    IProtocolDataProvider private immutable MOOLA_DATA_PROVIDER;

    constructor(ILendingPoolAddressesProvider _addressProvider, IProtocolDataProvider _dataProvider, IUniswapV2Router02 _router) FlashLoanReceiverBase(_addressProvider) UbeswapBase(_router) {
        MOOLA_DATA_PROVIDER = _dataProvider;
    }

    event PositionOpened(
        uint8 positionType
    );

    event PositionRepaid(
        uint8 positionType
    );

    function getName() public view returns (string memory) {
        return _name;
    }

    ///@notice executes after flashloan
    ///@param assets flashloan assets
    ///@param amounts flashloan amounts
    ///@param premiums flashloan premiums
    ///@param initiator flashloan initiator
    ///@param params type of operation
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        uint256 operation = abi.decode(params, (uint256));

        if (operation == 0) {
            _executeOpenLongPosition(assets[0], amounts[0], premiums[0], params);
        }

        if (operation == 1) {
            _executeOpenShortPosition(assets[0], amounts[0], premiums[0], params);
        }

        if (operation == 2) {
            _executeRepay(assets[0], amounts[0], premiums[0], params);
        }

        // Approve the LendingPool contract allowance to *pull* the owed amount
        for (uint i = 0; i < assets.length; i++) {
            uint amountOwing = amounts[i].add(premiums[i]);
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }

        return true;
    }

    /// @notice opens long leveraged position, i.e cUSD -> CELO
    /// @param baseAsset Base asset address
    /// @param quoteAsset Quote Asset address
    /// @param amount amount Base asset amount
    /// @param minAmount minimal amount of Quote Asset that will be deposited to Moola
    /// @param leverage - leverage size
    function openLongPosition(address baseAsset, address quoteAsset, uint256 amount, uint256 minAmount, uint256 leverage) external {
        // transfer amount of baseAsset to contract
        IERC20(baseAsset).transferFrom(msg.sender, address(this), amount);

        // take flashloan amount of baseAsset
        address[] memory assets = new address[](1);
        assets[0] = baseAsset;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount.mul(leverage.sub(1));

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        address onBehalfOf = address(this);
        bytes memory params = abi.encode(0, msg.sender, amount, minAmount, quoteAsset);
        uint16 referralCode = 0;

        LENDING_POOL.flashLoan(address(this), assets, amounts, modes, onBehalfOf, params, referralCode);

        emit PositionOpened(0);
    }

    function _executeOpenLongPosition(address asset,
        uint256 amount,
        uint256 premium,
        bytes memory params) private
    {
        // decode params
        (, address sender, uint256 initialAmount, uint256 minAmount, address quoteAsset) = abi.decode(params, (uint256, address, uint256, uint256, address));

        uint256 swapAmount = initialAmount.add(amount);

        // swap base assets to quote assets
        uint256[] memory afterSwapAmounts = _swap(asset, quoteAsset, swapAmount, minAmount, address(this));

        // approve quote asset amount received after swap
        IERC20(quoteAsset).approve(address(LENDING_POOL), afterSwapAmounts[1]);

        // deposit all quote assets to Moola onBehalfOf sender
        LENDING_POOL.deposit(quoteAsset, afterSwapAmounts[1], sender, 0);

        uint256 amountToRepay = amount.add(premium);

        // borrow flash amount + premium from Moola to repay flashloan
        LENDING_POOL.borrow(asset, amountToRepay, 1, 0, sender);
    }

    /// @notice opens short leveraged position, i.e cUSD -> CELO
    /// @param baseAsset Base asset address
    /// @param quoteAsset Quote Asset address
    /// @param amount amount Base asset amount
    /// @param minAmount minimal amount of Quote Asset that will be deposited to Moola
    /// @param leverage - leverage size
    function openShortPosition(address baseAsset, address quoteAsset, uint256 amount, uint256 loanAmount, uint256 minAmount, uint256 leverage) external {
        // transfer amount of baseAsset to contract
        IERC20(baseAsset).transferFrom(msg.sender, address(this), amount);
        // take flashloan amount of baseAsset
        address[] memory assets = new address[](1);
        assets[0] = quoteAsset;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = loanAmount;

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        address onBehalfOf = address(this);
        bytes memory params = abi.encode(1, msg.sender, amount, minAmount, baseAsset);
        uint16 referralCode = 0;

        LENDING_POOL.flashLoan(address(this), assets, amounts, modes, onBehalfOf, params, referralCode);

        emit PositionOpened(2);
    }

    function _executeOpenShortPosition(address asset,
        uint256 amount,
        uint256 premium,
        bytes memory params) private
    {
        // decode params
        (, address sender, uint256 initialAmount, uint256 minAmount, address baseAsset) = abi.decode(params, (uint256, address, uint256, uint256, address));

        // swap quote asset to base asset
        uint256[] memory afterSwapAmounts = _swap(asset, baseAsset, amount, minAmount, address(this));

        // approve base asset amount received after swap
//        uint256 depositAmount = afterSwapAmounts[1].add(initialAmount);
//        IERC20(baseAsset).approve(address(LENDING_POOL), depositAmount);

        // deposit all quote assets to Moola onBehalfOf sender
//        LENDING_POOL.deposit(baseAsset, depositAmount, sender, 0);
//
//        uint256 amountToRepay = amount.add(premium);
//
//        // borrow flash amount + premium from Moola to repay flashloan
//        LENDING_POOL.borrow(asset, amountToRepay, 1, 0, sender);
    }

    /// @notice repay or close leveraged position, i.e cUSD -> CELO
    /// @param debtAsset debt asset address
    /// @param collateralAsset collateral Asset address
    /// @param aCollateralAsset aToken address for a collateral asset
    /// @param debtAmount amount of debt asset that should be repaid
    /// @param collateralAmount amount of aTokens representing collateral in Quote Asset that will be sent to user's wallet after repay
    /// @param minAmount amount of Collateral asset that will be repaid
    function repay(address debtAsset, address collateralAsset, address aCollateralAsset, uint256 debtAmount, uint256 collateralAmount, uint256 minAmount) external {
        // take flashloan debtAmount
        address[] memory assets = new address[](1);
        assets[0] = debtAsset;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = debtAmount;

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        address onBehalfOf = address(this);

        bytes memory params = abi.encode(2, msg.sender, collateralAsset, aCollateralAsset, collateralAmount, minAmount);
        uint16 referralCode = 0;

        LENDING_POOL.flashLoan(address(this), assets, amounts, modes, onBehalfOf, params, referralCode);

        emit PositionRepaid(0);
    }

    function _executeRepay(address asset,
        uint256 amount,
        uint256 premium,
        bytes memory params) private
    {
        // decode params
        (, address sender, address collateralAsset, address aCollateralAsset, uint256 collateralAmount, uint256 minAmount) = abi.decode(params, (uint256, address, address, address, uint256, uint256));

        // approve debtAmount of base asset amount to repay to the lending pool
        IERC20(asset).approve(address(LENDING_POOL), amount);

        // repay all quote assets to Moola onBehalfOf of a user (sender)
        LENDING_POOL.repay(asset, amount, 1, sender);

        // pull aCollateralAsset tokens from user's wallet
        IERC20(aCollateralAsset).transferFrom(sender, address(this), collateralAmount);

        // withdraw quote asset collateral from the lending pool
        LENDING_POOL.withdraw(collateralAsset, collateralAmount, address(this));

        // swap quote asset to base assets
        uint256[] memory afterSwapAmounts = _swap(collateralAsset, asset, collateralAmount, minAmount, address(this));

        // calculate the difference between amount received after swap
        // and amount needed to repay flashloan
        uint256 remainder = afterSwapAmounts[1].sub(amount.add(premium));

        // if the remainder is greater then 0 send it to user's wallet
        if (remainder > 0) {
            IERC20(asset).transfer(sender, remainder);
        }
    }

    function _swap(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn,
        uint _amountOutMin,
        address _to
    ) private returns (uint[] memory amounts) {
        IERC20(_tokenIn).approve(address(UBESWAP_ROUTER), _amountIn);

        address[] memory path;

        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        return UBESWAP_ROUTER.swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );
    }

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn,
        uint _amountOutMin,
        address _to
    ) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(address(UBESWAP_ROUTER), _amountIn);

        address[] memory path;

        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        UBESWAP_ROUTER.swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );
    }

    function getAmountsOut(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn
    ) external view returns (uint amount) {

        address[] memory path;

        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        uint[] memory amounts =  UBESWAP_ROUTER.getAmountsOut(
            _amountIn,
            path
        );

        amount = amounts[1];
    }
}
