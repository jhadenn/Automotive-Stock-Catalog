import type { Product } from '@/lib/types'

/**
 * Configuration options for product search operations.
 */
interface SearchOptions {
  /** 
   * Similarity threshold between 0-1.
   * Higher values require closer matches. Default is 0.3.
   */
  threshold?: number;
  /** 
   * Maximum number of results to return.
   * Default is 10.
   */
  limit?: number;
}

/**
 * Service providing product search functionality with exact and fuzzy matching capabilities.
 * Supports searching across multiple product fields with configurable thresholds.
 */
export class SearchService {
  /**
   * Searches for products with exact substring matches in name, description, category, or SKU.
   * 
   * @param products - Array of products to search
   * @param term - Search term to look for
   * @returns Array of products containing exact matches for the search term
   */
  static searchExact(products: Product[], term: string): Product[] {
    if (!term || term.trim() === '') {
      return products;
    }

    const normalizedTerm = term.toLowerCase().trim();
    
    return products.filter(product => 
      product.name.toLowerCase().includes(normalizedTerm) ||
      product.description.toLowerCase().includes(normalizedTerm) ||
      product.category.toLowerCase().includes(normalizedTerm) ||
      product.sku.toLowerCase().includes(normalizedTerm)
    );
  }

  /**
   * Finds products based on text similarity and relevance scoring.
   * Uses a combination of exact matching, partial matching, and category relevance
   * to determine the most relevant products for a search term.
   * 
   * @param products - Array of products to search
   * @param term - Search term to look for
   * @param options - Configuration options for the search
   * @returns Array of products ranked by relevance score above the threshold
   */
  static findRelevantProducts(products: Product[], term: string, options: SearchOptions = {}): Product[] {
    const { threshold = 0.3, limit = 10 } = options;
    
    if (!term || term.trim() === '') {
      return [];
    }

    const normalizedTerm = term.toLowerCase().trim();
    const words = normalizedTerm.split(/\s+/);
    
    // Calculate relevance scores for each product
    const scoredProducts = products.map(product => {
      // Combine all searchable fields
      const searchText = [
        product.name,
        product.description,
        product.category,
        product.material,
        product.sku
      ].join(' ').toLowerCase();
      
      // Calculate similarity score
      let score = 0;
      
      // Score words that match exactly
      for (const word of words) {
        if (searchText.includes(word)) {
          score += 0.5;
        }
      }
      
      // Score partial matches using Levenshtein distance approach
      for (const word of words) {
        if (word.length < 3) continue; // Skip very short words
        
        // Look for partial matches
        for (const field of [product.name, product.description, product.category, product.material]) {
          const fieldText = field.toLowerCase();
          if (fieldText.includes(word.substring(0, Math.floor(word.length * 0.7)))) {
            score += 0.3;
            break;
          }
        }
        
        // Check for category relevance
        if (this.isCategoryRelevant(word, product.category)) {
          score += 0.2;
        }
      }
      
      return { product, score };
    });
    
    // Filter products with score above threshold
    const relevantProducts = scoredProducts
      .filter(item => item.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);
      
    return relevantProducts;
  }
  
  /**
   * Helper method to determine if a search term is relevant to a product category.
   * Uses predefined mappings of terms commonly associated with each category.
   * 
   * @param term - The search term to check
   * @param category - The product category to compare against
   * @returns True if the term is relevant to the category, false otherwise
   * @private
   */
  private static isCategoryRelevant(term: string, category: string): boolean {
    const categoryMappings: Record<string, string[]> = {
      'Parts': ['part', 'component', 'spare', 'replacement', 'fix', 'repair'],
      'Tools': ['tool', 'wrench', 'hammer', 'screwdriver', 'equipment', 'fix'],
      'Vehicles': ['car', 'truck', 'vehicle', 'auto', 'automobile', 'ride']
    };
    
    const relevantTerms = categoryMappings[category] || [];
    return relevantTerms.some(relTerm => 
      term.includes(relTerm) || relTerm.includes(term)
    );
  }
  
  /**
   * Performs a complete search operation, first attempting exact matches,
   * then falling back to relevant/fuzzy matches if no exact matches are found.
   * 
   * @param products - Array of products to search
   * @param term - Search term to look for
   * @param options - Configuration options for the search
   * @returns Object containing search results and a flag indicating if exact matches were found
   */
  static search(products: Product[], term: string, options: SearchOptions = {}): {
    results: Product[],
    exactMatch: boolean
  } {
    // First try exact search
    const exactResults = this.searchExact(products, term);
    
    if (exactResults.length > 0) {
      return {
        results: exactResults,
        exactMatch: true
      };
    }
    
    // Fall back to relevant search
    const relevantResults = this.findRelevantProducts(products, term, options);
    
    return {
      results: relevantResults,
      exactMatch: false
    };
  }
} 