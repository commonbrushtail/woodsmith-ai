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
  getRecommendedHighlights,
  getPublishedProducts,
  getPublishedGalleryItems,
} from '../../lib/data/public'

export default async function HomePage() {
  const [bannersRes, blogsRes, productsRes, galleryRes] = await Promise.all([
    getActiveBanners(),
    getPublishedBlogPosts({ perPage: 5 }),
    getPublishedProducts({ perPage: 12 }),
    getPublishedGalleryItems('homepage'),
  ])

  // Highlights: prefer recommended, fall back to all published
  const recommendedRes = await getRecommendedHighlights({ perPage: 4 })
  const highlightsRes = recommendedRes.data.length > 0
    ? recommendedRes
    : await getPublishedHighlights({ perPage: 4 })

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
