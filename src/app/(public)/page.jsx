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
  getRecommendedBlogPosts,
  getRecommendedProducts,
  getPublishedProducts,
  getPublishedGalleryItems,
} from '../../lib/data/public'

export default async function HomePage() {
  const [bannersRes, recHighlightsRes, recBlogsRes, recProductsRes, galleryRes] = await Promise.all([
    getActiveBanners(),
    getRecommendedHighlights({ perPage: 4 }),
    getRecommendedBlogPosts({ perPage: 5 }),
    getRecommendedProducts({ perPage: 12 }),
    getPublishedGalleryItems('homepage'),
  ])

  // Fallback to all published when no recommended items exist
  const [highlightsRes, blogsRes, productsRes] = await Promise.all([
    recHighlightsRes.data.length > 0 ? recHighlightsRes : getPublishedHighlights({ perPage: 4 }),
    recBlogsRes.data.length > 0 ? recBlogsRes : getPublishedBlogPosts({ perPage: 5 }),
    recProductsRes.data.length > 0 ? recProductsRes : getPublishedProducts({ perPage: 12 }),
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
