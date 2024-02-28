import { cn } from "@/lib/utils"
import { replaceString } from "@/utils"
import { FocusEvent, useCallback, useRef } from "react"

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value: string
  handleChange: (str: string) => void
  wrapperClassName?: string
  suffixIcon?: React.ReactNode
  prefixIcon?: React.ReactNode
  validCharRegex?: RegExp
  pattern?: string
}

/**
 * Used to apply the form value to a specific pattern
 *
 * @param value Form value 123456
 * @param pattern Input mask, e.g: 00-0000
 * @param validCharRegex Regex of all valid character, e.g: a-zA-Z0-9
 * @returns New value that applied the pattern e.g 12-3456
 */
const toPattern = (
  value: string,
  pattern: string = "00-000000000",
  validCharRegex: RegExp = /^[0-9a-zA-Z]+$/
) => {
  const values = value.split("")
  let pointer = 0

  return pattern
    .split("")
    .map((patternChar) => {
      if (validCharRegex.test(patternChar))
        return pointer < values.length ? values[pointer++] : patternChar
      return patternChar
    })
    .join("")
}

/**
 * Used to revert the pattern to pure value.
 *
 * @param value Value that applied the pattern e.g 12-3456
 * @param validCharRegex Regex of all valid character, e.g: a-zA-Z0-9
 * @returns Pure value e.g 123456
 */
const revertPattern = (
  value: string,
  validCharRegex: RegExp = /^[0-9a-zA-Z]+$/
) => {
  return value
    .split("")
    .map((v) => {
      if (validCharRegex.test(v)) return v
      return ""
    })
    .filter(Boolean)
    .join("")
}

const MaskInput = ({
  wrapperClassName,
  className,
  prefixIcon,
  suffixIcon,
  pattern = "00-000000000",
  validCharRegex = /^[0-9a-zA-Z]+$/,
  value,
  handleChange,
  onBlur,
  ...props
}: InputProps) => {
  // Tracking input for highlighting pattern
  const inputRef = useRef<HTMLInputElement>(null)

  // Tracking pattern start position, e.g MM/DD/YYYY, the maskStartPosition may equal 0, 3, 6
  const maskStartPosition = useRef(0)

  // Tracking pattern, e.g MM/DD/YYYY, the selectedMask may equal MM, DD, YYYY
  const selectedMask = useRef("")

  // Tracking pattern current index, used to track how many characters has been input
  const maskPointer = useRef(0)

  const hightLightPattern = useCallback((start: number, end: number) => {
    setTimeout(() => {
      inputRef.current?.setSelectionRange(start, end)
    })
  }, [])

  const setPatternByCaretPosition = useCallback(
    (caretPosition: number) => {
      const patterns = ["$", ...pattern, "$"]
      let left = caretPosition
      let right = caretPosition + 1
      while (validCharRegex.test(patterns[left])) --left
      while (validCharRegex.test(patterns[right])) ++right
      selectedMask.current = pattern.substring(left, right - 1)
      maskStartPosition.current = left
      maskPointer.current = 0
    },
    [pattern, validCharRegex]
  )

  // Select pattern
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const caretPosition = (e.target as HTMLInputElement).selectionStart ?? 0

    if (!value) handleChange(pattern)

    setPatternByCaretPosition(caretPosition)

    hightLightPattern(
      maskStartPosition.current,
      maskStartPosition.current + selectedMask.current.length
    )
  }

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement, Element>) => {
      if (value === pattern) handleChange("")
      onBlur?.(e)
    },
    [handleChange, pattern, onBlur, value]
  )

  const setNextPattern = useCallback(() => {
    setPatternByCaretPosition(
      Math.min(
        maskStartPosition.current + selectedMask.current.length + 1,
        pattern.length
      )
    )
  }, [pattern.length, setPatternByCaretPosition])

  const setPreviousPattern = useCallback(() => {
    setPatternByCaretPosition(Math.max(maskStartPosition.current - 2, 0))
  }, [setPatternByCaretPosition])

  const setValue = useCallback(() => {
    const newValue = replaceString(
      value,
      maskStartPosition.current,
      selectedMask.current
    )
    handleChange(newValue)
  }, [handleChange, value])

  const updateValue = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Clear flow
      if (e.key === "Backspace") {
        selectedMask.current = pattern.substring(
          maskStartPosition.current,
          maskStartPosition.current + selectedMask.current.length
        )
        setValue()
        maskPointer.current = 0
        return
      }

      if (e.key === "ArrowRight") setNextPattern()
      if (e.key === "ArrowLeft") setPreviousPattern()

      // Normal flow
      const inputValue = Number(e.key)
      if (isNaN(inputValue)) return

      // Shifting logic, e.g _ _ _, _ _ 1, _ 1 9, 1 9 5.
      selectedMask.current = [...selectedMask.current, inputValue]
        .join("")
        .substring(1)

      setValue()

      maskPointer.current += 1

      // After input all needed character for a pattern, go to next pattern, e.g: 22/DD/YYYY, next selectedPattern will be DD
      if (
        selectedMask.current.length &&
        maskPointer.current === selectedMask.current.length
      ) {
        setNextPattern()
      }
    },
    [pattern, setNextPattern, setPreviousPattern, setValue]
  )

  const handleInputByKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      updateValue(e)
      hightLightPattern(
        maskStartPosition.current,
        maskStartPosition.current + selectedMask.current.length
      )
    },
    [hightLightPattern, updateValue]
  )

  return (
    <div className={cn("relative", wrapperClassName)}>
      {prefixIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          {prefixIcon}
        </div>
      )}
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          prefixIcon && "pl-10",
          className
        )}
        ref={inputRef}
        {...props}
        type="text"
        inputMode="numeric"
        value={value}
        onKeyDown={handleInputByKeyDown}
        onChange={() => null}
        onClick={handleClick}
        onBlur={handleBlur}
      />
      {suffixIcon && (
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none border-l border border-0">
          {suffixIcon}
        </div>
      )}
    </div>
  )
}

MaskInput.displayName = "Input"

export { MaskInput, toPattern, revertPattern }
