import { University } from "@/types/user";

let universitiesCache: University[] | null = null;

export async function fetchUniversities(): Promise<University[]> {
  if (universitiesCache) {
    return universitiesCache;
  }

  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }
    
    const universities: University[] = await response.json();
    universitiesCache = universities;
    return universities;
  } catch (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
}

export function searchUniversities(universities: University[], query: string): University[] {
  if (!query.trim()) {
    return universities.slice(0, 50); // Show first 50 if no query
  }

  const searchTerm = query.toLowerCase().trim();
  
  return universities
    .filter(university => 
      university.name.toLowerCase().includes(searchTerm) ||
      university.country.toLowerCase().includes(searchTerm) ||
      (university.state_province && university.state_province.toLowerCase().includes(searchTerm))
    )
    .slice(0, 50); // Limit to 50 results for performance
}

export function getUniversityDisplayName(university: University): string {
  let displayName = university.name;
  
  if (university.state_province) {
    displayName += `, ${university.state_province}`;
  }
  
  displayName += `, ${university.country}`;
  
  return displayName;
}
