import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { get } from "lodash"

import { Column, Table } from "@tanstack/react-table"
import { Eye, EyeOff, GripVertical, LucideIcon } from "lucide-react"
import { CSSProperties, ReactNode, useMemo, useState } from "react"

import {
  Active,
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  Over,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import groupBy from "lodash.groupby"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

interface DataTableViewGroupProps<TData> {
  columns: Column<TData, unknown>[]
  onCtaClick: React.MouseEventHandler<HTMLButtonElement>
  label: ReactNode
  ctaText: string
  onItemClick: (column: Column<TData, unknown>) => VoidFunction
  Icon: LucideIcon
}

interface DataTableViewItemProps<TData> {
  column: Column<TData, unknown>
  onClick: VoidFunction
  Icon: LucideIcon
}

const enum EXTEND_ORDERED_COLUMN {
  HIDE_ALL = "Hide all",
  SHOW_ALL = "Show all"
}

const DataTableViewItem = <TData,>({
  column,
  onClick,
  Icon
}: DataTableViewItemProps<TData>) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: column.id
    })

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    whiteSpace: "nowrap",
    zIndex: isDragging ? 1 : 0
  }

  return (
    <DropdownMenuItem
      key={column.id}
      className={cn(
        "cursor-pointer flex justify-between gap-2 items-center relative p-0 pr-2",
        !column.getCanHide() && "cursor-default"
      )}
      ref={setNodeRef}
      style={style}
    >
      <div
        className="flex items-center gap-2 flex-1 px-2 py-1.5 pr-0"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 opacity-30" />
        <div>{column.columnDef?.meta?.columnViewName ?? ""}</div>
      </div>

      <Icon
        onClick={column.getCanHide() ? onClick : undefined}
        className={cn(
          "ml-auto w-6 h-6 p-1 z-10 text-gray-900",
          !column.getCanHide() && "text-gray-400",
          !column.getIsVisible() && "text-gray-500"
        )}
      />
    </DropdownMenuItem>
  )
}

const DataTableViewGroup = <TData,>({
  columns,
  onCtaClick,
  ctaText,
  label,
  onItemClick,
  Icon
}: DataTableViewGroupProps<TData>) => {
  const { setNodeRef, transform } = useSortable({
    id: ctaText
  })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform)
  }

  return (
    <DropdownMenuGroup>
      <div
        className="flex relative justify-between text-xs font-medium gap-2 pl-2 items-center mt-2 mb-1"
        style={style}
        ref={
          /**
           * We have two groups named 'Hide all' and 'Show all'
           * which serve as CTAs for clicking to hide or show all elements.
           * @see EXTEND_ORDERED_COLUMN
           * This condition will help us avoid dragging the group header 'Shown in table'.
           * But we should keep 'Hidden in table' for dragging the element down.
           */
          ctaText === EXTEND_ORDERED_COLUMN.HIDE_ALL ? undefined : setNodeRef
        }
      >
        <div className="text-muted-foreground">{label}</div>
        <Button
          variant="ghost"
          className="h-auto w-auto py-0.5 px-2 text-blue-500 text-xs"
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      </div>

      {columns.map((column) => {
        return (
          <DataTableViewItem<TData>
            key={column.id}
            onClick={onItemClick(column)}
            Icon={Icon}
            column={column}
          />
        )
      })}
    </DropdownMenuGroup>
  )
}

export function DataTableViewOptions<TData>({
  table
}: DataTableViewOptionsProps<TData>) {
  /**
   * Required array to work with https://tanstack.com/table/latest/docs/guide/column-visibility
   */
  const columnOrder = table.getState().columnOrder

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen((pre) => !pre)
  }

  /**
   * Because we need more data more then just a string[] like 'columnOrder'
   * So a mapping by ID is necessary here 'Dictionary<Column<TData, unknown>[]>'
   * @see columnOrder
   */
  const columnGroupById = useMemo(() => {
    return groupBy(table.getAllColumns(), (column) => column.id)
  }, [table])
  /**
   * Because the 'column.id' is unique, we will safe to use 'columnGroupById[columnId][0]'
   */
  const orderedColumn = useMemo(() => {
    return columnOrder.map((columnId) => get(columnGroupById, [columnId, 0]))
  }, [columnOrder, columnGroupById])
  /**
   * If we apply useMemo for 'shownColumns' and 'hiddenColumns' then it won't work as expected
   * Because we render the DataTableViewItem based on the order (Not based on the attribute visible + TanStack Table won't update the table for us)
   */
  const shownColumns = orderedColumn.filter((column) => column.getIsVisible())
  const hiddenColumns = orderedColumn.filter((column) => !column.getIsVisible())
  /**
   * Add two extended item in 'EXTEND_ORDERED_COLUMN'
   */
  const extendOrderedColumn = useMemo(() => {
    return [
      { id: EXTEND_ORDERED_COLUMN.HIDE_ALL },
      ...shownColumns,
      { id: EXTEND_ORDERED_COLUMN.SHOW_ALL },
      ...hiddenColumns
    ]
  }, [hiddenColumns, shownColumns])

  /**
   * Handle Show/Hide single column
   *
   * Initial
   * --- Shown Group --- (Won't count this index)
   * Item 1
   * Item 2
   * Item 3
   * Item 4
   * --- Hide Group --- (Won't count this index)
   * Item a
   * Item b
   *
   * * * * Hide scenario * * * *
   * Click Item 2
   * --- Shown Group ---
   * Item 1
   * Item 3
   * Item 4
   * --- Hide Group ---
   * Item 2 -> Toggle visibility (false) + move the index to (shownLength - 1 = 4 - 1 = 3)
   * Item a
   * Item b
   *
   * * * * Show scenario * * * *
   * Click Item a
   * --- Shown Group ---
   * Item 1
   * Item 3
   * Item 4
   * Item a -> Toggle visibility (true) + move the index to (shownLength - 0 = 3 - 0 = 3)
   * --- Hide Group ---
   * Item 2
   * Item b
   */
  const handleToggleColumn =
    (value: boolean) => (column: Column<TData>) => () => {
      table.setColumnOrder((preColumnOrder) => {
        const oldIndex = preColumnOrder.indexOf(column.id)
        return arrayMove(
          preColumnOrder,
          oldIndex,
          shownColumns.length - (value ? 0 : 1)
        )
      })
      column.toggleVisibility(value)
    }
  /**
   * Handle Show/Hide all column
   *
   * Initial
   * --- Shown Group ---
   * Item 1
   * Item 2
   * Disabled item 3
   * Item 4
   * Disabled item 5
   * --- Hide Group ---
   * Item a
   * Item b
   * Item c
   *
   * * * * Hide scenario * * * *
   * Click 'EXTEND_ORDERED_COLUMN.HIDE_ALL'
   * --- Shown Group ---
   * Disabled item 3
   * Disabled item 5
   * --- Hide Group ---
   * Item 1 -> toggleAllColumnsVisible (false, TanStack built in function allow us to avoid Disabled item)
   * Item 2
   * Item 4 -> keep the order, !!only move the Disabled item 5 and Disabled item 3 to the top (old index -> 0)
   * Item a
   * Item b
   * Item c
   *
   * * * * Show scenario * * * *
   * Click 'EXTEND_ORDERED_COLUMN.SHOW_ALL'
   * --- Shown Group ---
   * Disabled item 3 -> toggleAllColumnsVisible (true)
   * Disabled item 5
   * Item 1
   * Item 2
   * Item 3
   * Item 5
   * Item a
   * Item b
   * Item c -> keep the order, only move the Disabled item 5 and Disabled item 3 to the top (old index -> 0)
   */
  const handleToggleAllColumn = (value: boolean) => () => {
    if (!value) {
      orderedColumn
        .filter((column) => !column.getCanHide())
        .reverse()
        .forEach((column) => {
          handleReOrder(column)
        })
    }

    table.toggleAllColumnsVisible(value)
  }
  const handleReOrder = (column: Column<TData>) => {
    if (!column.getCanHide()) {
      table.setColumnOrder((preColumnOrder) => {
        const oldIndex = preColumnOrder.indexOf(column.id)
        return arrayMove(preColumnOrder, oldIndex, 0)
      })
    }
  }

  /**
   * Handle Drag all column
   **/
  const sensors = useSensors(
    // Allow us to drag with mouse
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  /*
   * Four scenario
   * 1. Same Shown Group and vice versa (Same Hide Group)
   * 2. From Shown to Hide and vice versa (From Hide to Show)
   *
   * Initial
   * --- Shown Group ---
   * Item 1
   * Item 2
   * Disabled item 3
   * Item 4
   * --- Hide Group --- (comparedIndex for knowing the item is moving down, or moving up)
   * Item a
   * Item b
   * Item c
   * Item d
   *
   * * * * 1. Same Shown Group * * * *
   * Drag Item 1 to under Disabled item 3
   * --- Shown Group ---
   * Item 2
   * Disabled item 3
   * Item 1 (oldIndex = 0, newIndex = 2)
   *        (Extended part: comparedIndex = 5, oldIndex = 1, newIndex = 3)
   *        (Moving up? oldIndex(1) > comparedIndex(5) && newIndex(3) <= comparedIndex(5) = false)
   *        (Moving down? oldIndex(1) < comparedIndex(5) && newIndex(3) >= comparedIndex(5) = false)
   *        (newVisibility = undefined -> Same group case)
   * Item 4
   * --- Hide Group ---
   * Item a
   * Item b
   * Item c
   * Item d
   *
   * * * * 2. Cross Group * * * *
   * Drag Item 2 to under Hide Group
   * --- Shown Group ---
   * Disabled item 3
   * Item 1
   * Item 4
   * --- Hide Group ---
   * Item 2  (oldIndex = 0, newIndex = -1)
   *         (Extended part: comparedIndex = 5, oldIndex = 1, newIndex = 5)
   *         (Moving up? oldIndex(1) > comparedIndex(5) && newIndex(5) <= comparedIndex(5) = false)
   *         (Moving down? oldIndex(1) < comparedIndex(5) && newIndex(5) >= comparedIndex(5) = true) -> return false
   *         (newVisibility = false -> Moving down)
   * Item a
   * Item b
   * Item c
   * Item d
   *
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      table.setColumnOrder((preColumnOrder) => {
        const oldIndex = preColumnOrder.indexOf(active.id as string)
        const newIndex = preColumnOrder.indexOf(over.id as string)
        if (oldIndex === -1) return preColumnOrder

        const newVisibility = handleReToggle(active, over)
        if (newVisibility === null) return preColumnOrder

        const addition =
          newVisibility === false ? 1 : newVisibility === true ? 0 : -1

        return arrayMove(
          preColumnOrder,
          oldIndex,
          /**
           * if newIndex === -1 mean the target is above 'EXTEND_ORDERED_COLUMN.SHOW_ALL'
           *                            ...  or under ...
           * Then should be moved with addition (Down - 1, Up - 0)
           * @see handleToggleColumn
           *
           * if !== -1 moving normally
           */
          newIndex !== -1 ? newIndex : shownColumns.length - addition
        )
      })
    }
  }
  const handleReToggle = (active: Active, over: Over) => {
    const oldIndex = extendOrderedColumn.findIndex(
      (column) => column.id === active.id
    )
    const newIndex = extendOrderedColumn.findIndex(
      (column) => column.id === over.id
    )
    const comparedIndex = extendOrderedColumn.findIndex(
      (column) => column.id === EXTEND_ORDERED_COLUMN.SHOW_ALL
    )

    // This condition ensure the group EXTEND_ORDERED_COLUMN.SHOW_ALL is shown
    if (comparedIndex === -1) return undefined

    const currentTarget = get(columnGroupById, [active.id, 0])

    const isMovingUp = oldIndex > comparedIndex && newIndex <= comparedIndex

    if (isMovingUp) {
      currentTarget.toggleVisibility(true)
      return true // Cross group case - Move Up
    }

    const isMovingDown = oldIndex < comparedIndex && newIndex >= comparedIndex

    if (isMovingDown) {
      if (!currentTarget.getCanHide()) return null // Prohibit case - Move disabled item
      currentTarget.toggleVisibility(false)
      return false // Cross group case - Move down
    }

    // Same group case
    return undefined
  }

  const handleResetOrder = () => {
    table.setColumnOrder(table.getAllColumns().map((column) => column.id))
    table.toggleAllColumnsVisible(true)
  }

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex text-slate-700 font-semibold rounded-md"
          onClick={handleOpen}
        >
          <Eye className="h-5 w-5 flex-shrink-0 mr-1" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[290px] max-h-96 overflow-auto"
        align="end"
        onEscapeKeyDown={handleOpen}
        onPointerDownOutside={handleOpen}
      >
        <DropdownMenuLabel className="flex justify-between items-center gap-2 pr-0">
          <div>Properties</div>
          <Button
            variant="ghost"
            className="h-auto w-auto py-0.5 px-2 text-blue-500 text-xs"
            onClick={handleResetOrder}
          >
            Reset
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={extendOrderedColumn}
            strategy={verticalListSortingStrategy}
          >
            <DataTableViewGroup<TData>
              columns={shownColumns}
              label="Shown in table"
              ctaText={EXTEND_ORDERED_COLUMN.HIDE_ALL}
              onCtaClick={handleToggleAllColumn(false)}
              onItemClick={handleToggleColumn(false)}
              Icon={Eye}
            />

            {!!hiddenColumns.length && (
              <DataTableViewGroup<TData>
                columns={hiddenColumns}
                label="Hidden in table"
                ctaText={EXTEND_ORDERED_COLUMN.SHOW_ALL}
                onCtaClick={handleToggleAllColumn(true)}
                onItemClick={handleToggleColumn(true)}
                Icon={EyeOff}
              />
            )}
          </SortableContext>
        </DndContext>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
