import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';

export default function SEOHelmet({
  title,
  description,
  canonicalUrl,
  imageUrl = '/images/hero-banner.svg',
  type = 'website',
  product = null,
  breadcrumbs = null
}) {
  const { settings } = useSettings();

  const siteTitle = settings.store_name || 'Taj-e-Konain Gas Burner';
  const fullTitle = title ? `${title} | ${siteTitle}` : (settings.meta_title_default || `${siteTitle} | Gas Stoves & Kitchen Appliances in Pakistan`);
  const metaDesc = description || settings.meta_description_default || 'Buy premium gas stoves, double burners, built-in hobs, commercial burners and accessories in Pakistan with direct WhatsApp ordering.';
  
  const domain = settings.production_domain ? settings.production_domain.replace(/\/+$/, '') : 'https://tajekonain.com';
  const fullCanonical = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${domain}${canonicalUrl}`) : domain;
  const fullImage = imageUrl.startsWith('http') ? imageUrl : `${domain}${imageUrl}`;

  // Build JSON-LD structured data
  const jsonLdScripts = [];

  // 1. Organization & LocalBusiness
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    'name': siteTitle,
    'description': metaDesc,
    'telephone': settings.phone_number || '+923432833991',
    'priceRange': 'Rs. 400 - Rs. 35,000',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': settings.address || 'House no.13/3 H area near, main Liaqat Market Rd, Model Colony H Area malir',
      'addressLocality': settings.city || 'Karachi',
      'postalCode': settings.postal_code || '75050',
      'addressCountry': 'PK'
    },
    'hasMap': settings.google_maps_url || 'https://share.google/31m1BrmEBxjzaiXpg',
    'openingHours': 'Mo-Sa 09:00-21:00',
    'url': domain,
    'image': fullImage
  };
  jsonLdScripts.push(businessSchema);

  // 2. Product Schema (if on product details page)
  if (product) {
    const productPrice = product.discount_price || product.price;
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name,
      'image': [fullImage],
      'description': product.short_description || product.description,
      'sku': product.sku,
      'brand': {
        '@type': 'Brand',
        'name': 'Taj-e-Konain'
      },
      'offers': {
        '@type': 'Offer',
        'url': fullCanonical,
        'priceCurrency': 'PKR',
        'price': productPrice,
        'priceValidUntil': '2027-12-31',
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': product.is_available && product.stock_quantity > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        'seller': {
          '@type': 'Organization',
          'name': siteTitle
        }
      }
    };
    jsonLdScripts.push(productSchema);
  }

  // 3. BreadcrumbList Schema (if breadcrumbs provided)
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': b.name,
        'item': b.url.startsWith('http') ? b.url : `${domain}${b.url}`
      }))
    };
    jsonLdScripts.push(breadcrumbSchema);
  }

  return (
    <Helmet>
      {/* Basic Title & Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured Data Scripts */}
      {jsonLdScripts.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
