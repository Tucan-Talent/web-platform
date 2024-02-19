import { Breadcrumbs } from "@/shared/molecules/Breadcrumbs"
import { Breadcrumb } from "@/types/common.type"

interface Props {
  breads: Breadcrumb[]
  rightFooter: React.ReactNode
}

export const TopBarDetail: React.FC<Props> = ({ breads, rightFooter }) => {
  return (
    <nav className="w-full h-16 md:h-20 shrink-0 flex justify-end md:justify-between items-center pr-2 md:pr-8 sticky top-0 bg-white border-b border-t md:border-t-0 z-20">
      <div className="hidden md:block">
        <Breadcrumbs breads={breads} />
      </div>

      {rightFooter}
    </nav>
  )
}
