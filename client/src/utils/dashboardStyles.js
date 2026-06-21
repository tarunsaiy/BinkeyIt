export const dashboardPageClass =
  'flex h-full min-h-0 flex-col overflow-hidden'

export const dashboardScrollAreaClass =
  'min-h-0 flex-1 overflow-y-auto thin-scrollbar pr-1'

export const dashboardTitleClass =
  'text-lg font-bold text-[#1c1c1c] sm:text-xl'

export const dashboardAddBtnClass =
  'text-sm font-semibold text-[#0C831F] hover:underline'

export const dashboardLinkActionClass =
  'text-xs font-semibold text-[#0C831F] hover:underline'

export const dashboardMutedTextClass = 'text-xs text-[#666666]'

export const dashboardItemMetaClass = 'text-[11px] text-[#666666]'

export const dashboardItemTitleClass = 'text-xs font-semibold text-[#1c1c1c]'

export const dashboardSectionTitleClass = 'text-xs font-bold text-[#1c1c1c]'

export const dashboardPriceClass = 'text-xs font-bold text-[#1c1c1c]'

export const dashboardBodyTextClass = 'text-xs leading-relaxed text-[#1c1c1c]'

export const dashboardPaginationTextClass = 'text-xs text-[#666666]'

export const dashboardDetailLabelClass = 'text-[11px] text-[#999999]'

export const dashboardLabelClass = 'mb-1.5 block text-xs text-[#666666]'

export const dashboardInputClass =
  'w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]'

export const dashboardTextareaClass =
  'w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F] resize-none'

export const dashboardSelectClass =
  'w-full rounded-xl border border-[#eeeeee] bg-white px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]'

export const dashboardPrimaryBtnClass =
  'flex w-full items-center justify-center rounded-xl bg-[#0C831F] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70'

export const dashboardSecondaryBtnClass =
  'rounded-lg border border-[#eeeeee] px-3 py-1.5 text-xs font-semibold text-[#666666] hover:bg-[#f8f8f8] disabled:opacity-50'

export const dashboardDangerBtnClass =
  'rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50'

export const dashboardOutlineBtnClass =
  'rounded-lg border border-[#eeeeee] px-3 py-1.5 text-xs font-semibold text-[#666666] hover:bg-[#f8f8f8]'

export const dashboardCardClass =
  'rounded-xl border border-[#eeeeee] bg-white overflow-hidden'

export const dashboardTagClass =
  'inline-flex items-center gap-1 rounded-full border border-[#eeeeee] bg-[#f8f8f8] px-2.5 py-1 text-[11px] font-medium text-[#1c1c1c]'

export const dashboardTagMutedClass =
  'inline-flex items-center rounded-full border border-[#eeeeee] bg-[#f8f8f8] px-1.5 py-0.5 text-[11px] font-medium text-[#666666]'

export const dashboardTableHeaderClass =
  'whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold text-[#666666]'

export const dashboardTableCellClass = 'px-3 py-2 text-xs text-[#1c1c1c]'

export const dashboardTableCellMutedClass = 'px-3 py-2 text-[11px] text-[#666666]'

export const dashboardIconBtnClass =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#eeeeee] bg-white hover:bg-[#fafafa]'

export const dashboardMenuTitleClass = 'text-sm font-bold text-[#1c1c1c]'

export const dashboardMenuMetaClass = 'text-[11px] text-[#666666]'

export const dashboardModalOverlayClass =
  'fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center'

export const dashboardModalClass =
  'flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl'

export const dashboardModalWideClass =
  'flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl'

export const dashboardModalHeaderClass =
  'flex shrink-0 items-center justify-between border-b border-[#eeeeee] px-4 py-4'

export const dashboardModalBodyClass =
  'min-h-0 flex-1 overflow-y-auto thin-scrollbar px-4 py-4'

export const dashboardModalTitleClass = 'text-base font-bold text-[#1c1c1c]'

export const dashboardCloseBtnClass =
  'flex h-8 w-8 items-center justify-center rounded-lg text-[#666666] hover:bg-[#f3f3f3]'

export const dashboardMenuLinkClass = (isActive) =>
  `block px-4 py-2.5 text-xs transition-colors ${
    isActive
      ? 'bg-[#eeeeee] font-semibold text-[#1c1c1c]'
      : 'font-normal text-[#666666] hover:bg-[#f3f3f3]'
  }`
