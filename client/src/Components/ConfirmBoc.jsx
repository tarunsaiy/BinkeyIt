import React from 'react'
import { IoClose } from 'react-icons/io5'
import {
  dashboardBodyTextClass,
  dashboardCloseBtnClass,
  dashboardDangerBtnClass,
  dashboardModalClass,
  dashboardModalHeaderClass,
  dashboardModalOverlayClass,
  dashboardModalTitleClass,
  dashboardSecondaryBtnClass,
} from '../utils/dashboardStyles'

const ConfirmBoc = ({ cancel, confirm, close }) => {
  return (
    <div className={dashboardModalOverlayClass}>
      <div className={`${dashboardModalClass} p-0`}>
        <div className={dashboardModalHeaderClass}>
          <h2 className={dashboardModalTitleClass}>Permanent delete</h2>
          <button type="button" onClick={close} className={dashboardCloseBtnClass}>
            <IoClose size={22} />
          </button>
        </div>

        <div className="px-4 pb-4">
          <p className={`${dashboardBodyTextClass} text-[#666666]`}>
            Are you sure you want to delete this item? This action cannot be undone.
          </p>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button type="button" onClick={cancel} className={dashboardSecondaryBtnClass}>
              Cancel
            </button>
            <button type="button" onClick={confirm} className={dashboardDangerBtnClass}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmBoc
