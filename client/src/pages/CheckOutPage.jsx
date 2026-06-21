import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../Provider/GlobalProvider'

const CheckOutPage = () => {
  const { openCheckout } = useGlobalContext()
  const navigate = useNavigate()

  useEffect(() => {
    openCheckout()
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }, [openCheckout, navigate])

  return null
}

export default CheckOutPage
