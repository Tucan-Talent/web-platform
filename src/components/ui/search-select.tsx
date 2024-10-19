import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { type Option } from "@/types/common.type"
import { Check, ChevronDown, Loader } from "lucide-react"
import React, {
  type FocusEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react"
import {
  type ControllerRenderProps,
  type FieldValues,
  type Path
} from "react-hook-form"

interface SearchSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> {
  options: Option[]
  disabled?: boolean
  field: ControllerRenderProps<TFieldValues, TName>
  label?: string
  placeholder?: string
  handleSearch?: (value: string) => void
  isFetching?: boolean
  totalOptions?: number
  renderOption?: (option: Option, isSelected: boolean) => ReactNode
  customLoader?: ReactNode
  maxHeight?: string
  popoverWidth?: string
}

export function SearchSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  options,
  field,
  label,
  placeholder = "Start typing...",
  handleSearch,
  isFetching = false,
  totalOptions,
  renderOption,
  customLoader,
  maxHeight = "14rem",
  popoverWidth = "24rem",
  disabled
}: SearchSelectProps<TFieldValues, TName>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isViewMode, setIsViewMode] = useState(!!field.value)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const preventAutoFocus = useCallback(
    (e: Event | FocusEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    },
    []
  )

  const setViewMode = useCallback((value: boolean) => {
    setIsViewMode(value)
  }, [])

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      setSearchValue(value)
      handleSearch?.(value)
      setIsOpen(!!value)
    },
    [handleSearch]
  )

  const handleOptionClick = useCallback(
    (option: Option) => {
      field.onChange(option)
      setViewMode(true)
      setIsOpen(false)
    },
    [field, setViewMode]
  )

  const isSelected = useCallback(
    (option: Option) => field.value?.value === option.value,
    [field.value]
  )

  const defaultRenderOption = useCallback(
    (option: Option, isSelected: boolean) => (
      <>
        <span className="flex-1">{option.label}</span>
        <Check
          className={cn(
            "ml-auto h-4 w-4 self-start mt-1",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
      </>
    ),
    []
  )

  const handleViewModeClick = useCallback(() => {
    setViewMode(false)
    setIsOpen(true)
    setTimeout(() => searchInputRef.current?.focus())
  }, [setViewMode])

  const handleInputClick = useCallback(
    () => setIsOpen(!!searchValue.length),
    [searchValue.length]
  )

  const handleInputBlur = useCallback(() => {
    if (field.value) setViewMode(true)
    setIsOpen(false)
  }, [field.value, setViewMode])

  const loader = useMemo(
    () =>
      customLoader || (
        <Loader
          className={cn(
            "w-4 transition-all animate-spin text-primary shrink-0"
          )}
        />
      ),
    [customLoader]
  )

  const renderSearchInput = () => (
    <Input
      ref={searchInputRef}
      autoComplete="off"
      placeholder={placeholder}
      suffixIcon={isFetching ? loader : null}
      value={searchValue}
      onBlur={handleInputBlur}
      onChange={onSearch}
      onClick={handleInputClick}
    />
  )

  const renderViewMode = () => (
    <div
      className="h-full w-full absolute top-0 bg-white border flex items-center px-3 rounded-md cursor-pointer justify-between"
      onClick={handleViewModeClick}
    >
      <p className="truncate min-w-0">
        {field.value?.label ?? (
          <span className="opacity-80">Please select</span>
        )}
      </p>
      {!handleSearch ? <ChevronDown className="ml-0.5 w-4 opacity-80" /> : null}
    </div>
  )

  const renderOptionsList = () => (
    <ul className="overflow-auto" style={{ maxHeight }}>
      {options.map((option) => (
        <li
          key={option.value}
          className="flex gap-1 items-center text-sm p-3 hover:bg-zinc-200 cursor-pointer"
          onClick={() => handleOptionClick(option)}
        >
          {renderOption
            ? renderOption(option, isSelected(option))
            : defaultRenderOption(option, isSelected(option))}
        </li>
      ))}
    </ul>
  )

  const renderSearchStatus = () => (
    <div className="text-sm p-3 bg-zinc-100 flex gap-1 break-all">
      {isFetching ? loader : totalOptions} matches found for "{searchValue}"
    </div>
  )

  return (
    <FormItem className="flex flex-col flex-1 max-w-96">
      {label ? <FormLabel>{label}</FormLabel> : null}

      <Popover
        open={isOpen ? !handleSearch || !!searchValue : undefined}
        onOpenChange={!handleSearch ? setIsOpen : undefined}
      >
        <PopoverTrigger asChild disabled={disabled}>
          <div className="w-full relative h-10">
            {isViewMode || !handleSearch
              ? renderViewMode()
              : renderSearchInput()}
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0 rounded-lg"
          sideOffset={8}
          style={{ width: popoverWidth }}
          onFocus={preventAutoFocus}
          onOpenAutoFocus={preventAutoFocus}
        >
          {handleSearch ? (
            <div className="overflow-hidden rounded-lg">
              {renderOptionsList()}
              {renderSearchStatus()}
            </div>
          ) : (
            <AutoSearch field={field} options={options} />
          )}
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )
}

function AutoSearch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({ options, field }: Partial<SearchSelectProps<TFieldValues, TName>>) {
  return (
    <Command>
      <CommandInput className="h-9" placeholder="Search..." />
      <CommandList>
        {!options?.length ? (
          <div className="py-3 text-center text-sm">No results found.</div>
        ) : (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        <CommandGroup>
          {options?.map((option) => (
            <CommandItem
              key={option.value}
              value={option.label}
              onSelect={() => {
                field?.onChange(option)
              }}
            >
              {option.label}
              <Check
                className={cn(
                  "ml-auto h-4 w-4",
                  option.value === field?.value?.value
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
