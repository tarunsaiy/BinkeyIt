import React from 'react'
import { IoClose } from 'react-icons/io5'
import {
  dashboardCloseBtnClass,
  dashboardInputClass,
  dashboardLabelClass,
  dashboardModalBodyClass,
  dashboardModalClass,
  dashboardModalHeaderClass,
  dashboardModalOverlayClass,
  dashboardModalTitleClass,
  dashboardPrimaryBtnClass,
} from '../utils/dashboardStyles'

const AddField = ({ close, onChange, onClick, value }) => {
  return (
    <section className={dashboardModalOverlayClass}>
      <div className={dashboardModalClass}>
        <div className={dashboardModalHeaderClass}>
          <h2 className={dashboardModalTitleClass}>Add field</h2>
          <button type="button" onClick={close} className={dashboardCloseBtnClass}>
            <IoClose size={22} />
          </button>
        </div>

        <div className={dashboardModalBodyClass}>
          <label htmlFor="fieldName" className={dashboardLabelClass}>Field name</label>
          <input
            id="fieldName"
            onChange={onChange}
            value={value}
            type="text"
            className={dashboardInputClass}
            placeholder="Enter field name"
          />
          <button type="button" onClick={onClick} className={`mt-4 ${dashboardPrimaryBtnClass}`}>
            Add field
          </button>
        </div>
      </div>
    </section>
  )
}

export default AddField
