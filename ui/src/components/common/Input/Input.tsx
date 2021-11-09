import classNames from 'classnames'
import React, { FC, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const InputElement = styled.input`
  position: relative;

  padding: 0;
  max-width: 150px;

  color: #fff;
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
  letter-spacing: 0.02em;

  background-color: transparent;
  border: none;
  outline: none;

  appearance: none;

  &.isZero {
    color: #45364d;
  }

  &::placeholder {
    color: #45364d;
  }

  &::before {
    position: absolute;

    display: block;

    color: #45364d;

    content: attr(placeholder);
  }
`

const Span = styled(InputElement)`
  position: absolute;
  opacity: 0;
`

interface Props {
  onlyDecimal?: boolean
}

// TODO: Try to implement a less complex logic
export const Input: FC<Props & InputHTMLAttributes<HTMLInputElement>> = ({
  placeholder,
  onlyDecimal,
  value,
  onChange,
  className,
  ...props
}) => {
  const [localValue, setLocalValue] = useState(String(value))
  const [width, setWidth] = useState(21) // precalculated width of 0
  const span = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (span.current?.offsetWidth) {
      setWidth(span.current.offsetWidth)
    }
  }, [localValue, placeholder])

  useEffect(() => {
    const isSame = Number(value) === Number(localValue)
    const isLastDot = localValue.slice(-1) === '.'
    const isLastDotZero = localValue.slice(-2) === '.0'

    if (!isSame || (!isSame && !isLastDot && !isLastDotZero)) {
      setLocalValue(String(value))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) {
      return
    }

    let nextValue = e.target.value
      .replace(',', '.')
      .replace(/[^\d.,]/g, '')
      .replace(/^0(\d+)/g, '$1')
      .replace(/^(\d*\.?)|(\d*)\.?/g, '$1$2')

    if (nextValue === '.') {
      nextValue = '0.'
    }

    if (onlyDecimal) {
      nextValue = String(parseInt(nextValue) || 0)
    }

    // some hack in ultimate hack component
    e.target.value = nextValue
    setLocalValue(e.target.value)
    onChange(e)
  }

  return (
    <>
      <Span as="span" ref={span}>
        {localValue || placeholder}
      </Span>
      <InputElement
        {...props}
        placeholder={placeholder}
        autoFocus
        value={localValue}
        style={{ width: width }}
        onChange={handleChange}
        className={classNames(className, { isZero: !localValue })}
      />
    </>
  )
}
