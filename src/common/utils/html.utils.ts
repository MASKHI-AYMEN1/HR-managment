/**
 * Process HTML content to ensure it displays properly within container constraints
 * Adds inline styles to prevent overflow and handle responsive display
 * 
 * @param html - Raw HTML string from WYSIWYG editor
 * @returns Processed HTML string with added styles
 */
export const processHtmlContent = (html: string): string => {
  // Return raw HTML if running on server-side
  if (typeof window === 'undefined') return html
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  // Add inline styles to prevent overflow on all elements
  const allElements = tempDiv.querySelectorAll('*')
  allElements.forEach((element) => {
    const el = element as HTMLElement
    el.style.maxWidth = '100%'
    el.style.wordWrap = 'break-word'
    el.style.overflowWrap = 'break-word'
  })
  
  // Handle images - make them responsive
  const images = tempDiv.querySelectorAll('img')
  images.forEach((img) => {
    img.style.maxWidth = '100%'
    img.style.height = 'auto'
    img.style.display = 'block'
  })
  
  // Handle tables - fixed layout to prevent overflow
  const tables = tempDiv.querySelectorAll('table')
  tables.forEach((table) => {
    const tableEl = table as HTMLElement
    tableEl.style.width = '100%'
    tableEl.style.maxWidth = '100%'
    tableEl.style.tableLayout = 'fixed'
  })
  
  // Handle pre and code blocks - allow horizontal scroll if needed
  const pres = tempDiv.querySelectorAll('pre')
  pres.forEach((pre) => {
    const preEl = pre as HTMLElement
    preEl.style.maxWidth = '100%'
    preEl.style.overflowX = 'auto'
    preEl.style.whiteSpace = 'pre-wrap'
    preEl.style.wordBreak = 'break-word'
  })
  
  return tempDiv.innerHTML
}
