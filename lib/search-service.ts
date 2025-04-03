import type { Product } from '@/lib/types'

interface SearchOptions {
  threshold?: number;  // Similarity threshold (0-1)
  limit?: number;      // Maximum number of results
}

export class SearchService {
  // Search for products with exact matches
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

  // Get relevant products based on similarity
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
  
  // Helper method to check if search term is related to a category
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
  
  // Perform a search with fallback to relevant results
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