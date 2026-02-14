import HeroSection from '../../components/HeroSection'
import AboutSection from '../../components/AboutSection'
import BlogSection from '../../components/BlogSection'
import HighlightSection from '../../components/HighlightSection'
import ProductsSection from '../../components/ProductsSection'
import GallerySection from '../../components/GallerySection'
import {
  getActiveBanners,
  getPublishedBlogPosts,
  getPublishedHighlights,
  getPublishedProducts,
  getPublishedGalleryItems,
} from '../../lib/data/public'

export default async function HomePage() {
  const [bannersRes, blogsRes, highlightsRes, productsRes, galleryRes] = await Promise.all([
    getActiveBanners(),
    getPublishedBlogPosts({ perPage: 5 }),
    getPublishedHighlights({ perPage: 4 }),
    getPublishedProducts({ perPage: 12 }),
    getPublishedGalleryItems(),
  ])

  return (
    <>
      <HeroSection banners={bannersRes.data} />
      <AboutSection />
      <BlogSection posts={blogsRes.data} />
      <HighlightSection highlights={highlightsRes.data} />
      <ProductsSection products={productsRes.data} />
      <GallerySection items={galleryRes.data} />
    </>
  )
}
