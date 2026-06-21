import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../common/summaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { PRODUCT_CARD_SCROLL_WIDTH_CLASS } from '../utils/productCardLayout'

const ScrollButton = ({ direction, onClick, className }) => {
  const Icon = direction === 'left' ? IoChevronBack : IoChevronForward

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
      className={`absolute top-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#eeeeee] bg-white text-[#666666] shadow-md transition hover:bg-[#fafafa] ${className}`}
    >
      <Icon size={18} />
    </button>
  )
}

const SimilarProducts = ({ categoryId, categoryName, excludeProductId }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const containerRef = useRef(null)

  const updateScrollButtons = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 4)
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 4
    )
  }, [])

  const scrollProducts = (direction) => {
    const container = containerRef.current
    if (!container) return

    const firstCard = container.firstElementChild
    const cardWidth = firstCard?.getBoundingClientRect().width || 160
    const gap = 8
    const scrollAmount = (cardWidth + gap) * 2

    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    })
  }

  const fetchSimilarProducts = async () => {
    if (!categoryId) return

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id: categoryId },
      })
      const { data: responseData } = response
      if (responseData.success) {
        const filtered = responseData.data.filter(
          (product) => product._id !== excludeProductId
        )
        setData(filtered)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSimilarProducts()
  }, [categoryId, excludeProductId])

  useEffect(() => {
    updateScrollButtons()
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', updateScrollButtons)
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      container.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [loading, data.length, updateScrollButtons])

  if (!loading && data.length === 0) {
    return null
  }

  const loadingCardNumber = new Array(6).fill(null)
  const title = categoryName ? `Similar products in ${categoryName}` : 'Similar products'

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="container mx-auto flex items-center justify-between gap-4 py-4">
        <h3 className="text-lg font-bold text-slate-700">{title}</h3>
      </div>
      <div className="container mx-auto pb-6">
        <div className="relative">
          {canScrollLeft && (
            <ScrollButton
              direction="left"
              onClick={() => scrollProducts(-1)}
              className="left-0 -translate-x-full -translate-y-1/2"
            />
          )}

          {canScrollRight && (
            <ScrollButton
              direction="right"
              onClick={() => scrollProducts(1)}
              className="right-0 translate-x-full -translate-y-1/2"
            />
          )}

          <div
            className="flex items-stretch gap-2 overflow-x-auto pb-2 no-scrollbar md:gap-2"
            ref={containerRef}
          >
            {loading &&
              loadingCardNumber.map((_, ind) => (
                <div key={ind} className={PRODUCT_CARD_SCROLL_WIDTH_CLASS}>
                  <CardLoading fluid />
                </div>
              ))}
            {!loading &&
              data.map((product) => (
                <div key={product._id} className={PRODUCT_CARD_SCROLL_WIDTH_CLASS}>
                  <CardProduct data={product} fluid />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SimilarProducts
