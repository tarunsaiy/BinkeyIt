import React from 'react'

const CardLoading = ({ fluid = false }) => {
  return (
    <div
      className={`flex animate-pulse flex-col overflow-hidden rounded-xl border border-[#eef0f2] bg-white ${
        fluid ? 'min-w-0 w-full max-w-none' : 'min-w-[148px] max-w-[176px] shrink-0'
      }`}
    >
      <div className="flex flex-col p-3">
        <div className="mb-2 aspect-square w-full rounded-lg bg-[#f3f4f6]" />

        <div className="mb-1.5 h-5 w-16 rounded-full bg-[#f3f4f6]" />

        <div className="mb-1 h-3 w-full rounded bg-[#f3f4f6]" />
        <div className="mb-0.5 h-3 w-[85%] rounded bg-[#f3f4f6]" />

        <div className="mb-3 h-3 w-12 rounded bg-[#f3f4f6]" />

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="space-y-1.5">
            <div className="h-4 w-12 rounded bg-[#f3f4f6]" />
            <div className="h-3 w-10 rounded bg-[#f3f4f6]" />
          </div>
          <div className="h-8 w-[58px] rounded-lg border border-[#eef0f2] bg-[#f3f4f6]" />
        </div>
      </div>
    </div>
  )
}

export default CardLoading
