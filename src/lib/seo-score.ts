export type SeoIssue =
  | 'missing_keyword'
  | 'keyword_not_in_title'
  | 'keyword_not_in_meta_title'
  | 'missing_meta_title'
  | 'meta_title_too_short'
  | 'meta_title_too_long'
  | 'missing_meta_description'
  | 'meta_description_too_short'
  | 'meta_description_too_long'
  | 'low_word_count'
  | 'missing_image'
  | 'not_published'

export interface SeoScore {
  score: number
  issues: SeoIssue[]
}

export function computeSeoScore(post: {
  focusKeyword?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  title?: string | null
  content?: string | null
  wordCount?: number | null
  imageUrl?: string | null
  wpPostUrl?: string | null
}): SeoScore {
  const issues: SeoIssue[] = []
  let score = 0

  const kw = (post.focusKeyword ?? '').trim().toLowerCase()
  const metaTitle = (post.metaTitle ?? '').trim()
  const metaDesc = (post.metaDescription ?? '').trim()
  const postTitle = (post.title ?? '').trim().toLowerCase()
  const content = (post.content ?? '').trim().toLowerCase()
  const wordCount = post.wordCount ?? 0

  // Focus keyword: +2
  if (kw) {
    score += 2
  } else {
    issues.push('missing_keyword')
  }

  // Keyword in post title: +1
  if (kw && postTitle.includes(kw)) {
    score += 1
  } else if (kw) {
    issues.push('keyword_not_in_title')
  }

  // Keyword in meta title: +1
  if (kw && metaTitle.toLowerCase().includes(kw)) {
    score += 1
  } else if (kw) {
    issues.push('keyword_not_in_meta_title')
  }

  // Meta title presence and length: +1 or +0.5
  if (metaTitle) {
    if (metaTitle.length >= 50 && metaTitle.length <= 60) {
      score += 1
    } else {
      score += 0.5
      if (metaTitle.length < 50) {
        issues.push('meta_title_too_short')
      } else if (metaTitle.length > 60) {
        issues.push('meta_title_too_long')
      }
    }
  } else {
    issues.push('missing_meta_title')
  }

  // Meta description presence and length: +1 or +0.5
  if (metaDesc) {
    if (metaDesc.length >= 150 && metaDesc.length <= 160) {
      score += 1
    } else {
      score += 0.5
      if (metaDesc.length < 150) {
        issues.push('meta_description_too_short')
      } else if (metaDesc.length > 160) {
        issues.push('meta_description_too_long')
      }
    }
  } else {
    issues.push('missing_meta_description')
  }

  // Word count: +1 for 800+, +0.5 bonus for 1500+
  if (wordCount >= 1500) {
    score += 1.5
  } else if (wordCount >= 800) {
    score += 1
  } else {
    issues.push('low_word_count')
  }

  // Featured image: +1
  if (post.imageUrl) {
    score += 1
  } else {
    issues.push('missing_image')
  }

  // Published to WordPress: +1
  if (post.wpPostUrl) {
    score += 1
  } else {
    issues.push('not_published')
  }

  return {
    score: Math.min(score, 10),
    issues,
  }
}
