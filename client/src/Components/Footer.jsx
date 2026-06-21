import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaThreads, FaXTwitter } from "react-icons/fa6";
import validUrl from "../utils/validUrlConvert";

const splitIntoColumns = (items, columns = 3) => {
  const perColumn = Math.ceil(items.length / columns);
  return Array.from({ length: columns }, (_, index) =>
    items.slice(index * perColumn, (index + 1) * perColumn)
  );
};

const FooterLink = ({ children, to = "#", onClick }) => {
  const className =
    "text-[#666666] hover:text-[#000000] transition-colors";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} text-left cursor-pointer`}>
        {children}
      </button>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

function Footer() {
  const navigate = useNavigate();
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.subCategory);
  const categoryColumns = splitIntoColumns(categoryData, 3);

  const handleCategoryClick = (id, name) => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((category) => category._id === id)
    );

    if (!subcategory) return;

    navigate(`/${validUrl(name)}-${id}/${validUrl(subcategory.name)}-${subcategory._id}`);
  };

  return (
    <footer className="bg-white border-t border-[#eeeeee]">
      <div className="container mx-auto py-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-[#000000]">Categories</h3>
            <Link to="/" className="font-medium text-[#0C831F] hover:underline">
              see all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-0">
            {categoryColumns.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col">
                {column.map((category) => (
                  <li key={category._id}>
                    <FooterLink onClick={() => handleCategoryClick(category._id, category.name)}>
                      {category.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F8F8F8] border-y border-[#eeeeee]">
        <div className="container mx-auto py-5 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-[#666666] order-2 lg:order-1">
            © Binkey Commerce Private Limited, 2016-2026
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 order-1 lg:order-2">
            <span className="font-bold text-[#333333]">Download App</span>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-black text-white rounded-md px-3 py-1.5 hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="leading-tight text-left">
                  Download on the
                  <br />
                  <span className="font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-black text-white rounded-md px-3 py-1.5 hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                </svg>
                <span className="leading-tight text-left">
                  GET IT ON
                  <br />
                  <span className="font-semibold">Google Play</span>
                </span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 order-3">
            {[
              { Icon: FaFacebookF, label: "Facebook" },
              { Icon: FaXTwitter, label: "X" },
              { Icon: FaInstagram, label: "Instagram" },
              { Icon: FaLinkedinIn, label: "LinkedIn" },
              { Icon: FaThreads, label: "Threads" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4">
        <p className="text-[#888888] text-center lg:text-left">
          &ldquo;Binkeyit&rdquo; is owned &amp; managed by &ldquo;Binkey Commerce Private
          Limited&rdquo; and is not related, linked or interconnected in whatsoever manner or
          nature, to &ldquo;GROFFR.COM&rdquo; which is a real estate services business operated by
          &ldquo;Redstone Consultancy Services Private Limited&rdquo;.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
