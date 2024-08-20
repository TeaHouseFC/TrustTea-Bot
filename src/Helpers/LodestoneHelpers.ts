import axios from "axios";
import * as cheerio from "cheerio";


// Example Query In Browser
// https://na.finalfantasyxiv.com/lodestone/character/?q=Art+Bayard&worldname=Carbuncle&classjob=&race_tribe=&blog_lang=ja&blog_lang=en&blog_lang=de&blog_lang=fr&order=
const baseURL = "https://na.finalfantasyxiv.com/lodestone/character/?q=";
// World Parameter is currently hardcoded to Carbuncle as we only need to query the FCs server location
let world = "Carbuncle"
const endQueryURL = `&worldname=${world}&classjob=&race_tribe=&blog_lang=ja&blog_lang=en&blog_lang=de&blog_lang=fr&order=`;
let nameParameter = "";



// Robustly Checks the Lodestone for character Free Company
// Returns Message to cover every scenario
export const RobustlyCheckLodestoneFreeCompany = async (firstName: string, lastName: string): Promise<string> => {

    if (await isNullOrEmpty(firstName) || await isNullOrEmpty(lastName)) {
        return "First Name or Last Name is null or empty";
    } else {
        try {
            const content = await GetWebContent(firstName, lastName);
            if (!content) {
                return "Error Getting Initial Web Content";
            } else {
            let webContent = cheerio.load(content);
            if (!webContent) {
                return "Error Getting Initial Web Content";
            } else {
                let href = webContent('a.entry__link').first().attr('href');
                if (!href) {
                    return "Error Getting Character ID - No Characters were found";
                } else {
                    let url = href.match(/\/lodestone\/character\/(\d+)\//);
                    if (!url) {
                        return "Error Getting Character URL - CSS Selectors For Character URL May Have Changed";
                    } else {
                        let characterId = url[1];
                        if (!characterId) {
                            return "Error Parsing Character ID - Character URL May Have Changed";
                        } else {
                            // Found Character ID - Meaning Player Name is Valid and Found
                            // Now Get Free Company Name
                            let freeCompany = webContent('a.entry__freecompany__link').first().find('span').text();
                            if (!freeCompany) {
                                // Character not in a Free Company or CSS Selector may have updated
                                return "Character not in a free company or CSS Selector may have updated";
                            } else {
                                // Free Company Found
                                return freeCompany;
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Error getting Free Company:", err);
            return `Error: ${err}`;
        }
    }
}

// Primitively returns the Character Id
// Useful for checking basic CSS Selectors
export const GetLodestoneCharacterId = async (firstName: string, lastName: string): Promise<string> => {

    if (await isNullOrEmpty(firstName) || await isNullOrEmpty(lastName)) {
        return "First Name or Last Name is null or empty";
    } else {
        try {
            const content = await GetWebContent(firstName, lastName);
            if (content) {
                const webContent = cheerio.load(content);
                const href = webContent('a.entry__link').first().attr('href');
                if (href) {
                    const characterId = href.match(/\/lodestone\/character\/(\d+)\//);
                    if (characterId) {
                        return characterId[1];
                    } else {
                        return "Error Getting Character ID";
                    }
                } else {
                    return "No Character Found corresponding to this name";
                }
            } else {
                return "Unable to get web content";
            }
        } catch (err) {
            console.error("Error getting Free Company:", err);
            return `Error: ${err}`;
        }
    }

}

// Primitively returns the Free Company Name
// Useful for checking basic CSS Selectors
export const GetLodestoneFreeCompany = async (firstName: string, lastName: string): Promise<string> => {

    if (await isNullOrEmpty(firstName) || await isNullOrEmpty(lastName)) {
        return "First Name or Last Name is null or empty";
    } else {
        try {
            const content = await GetWebContent(firstName, lastName);
            if (content) {
                const webContent = cheerio.load(content);
                const spanText = webContent('a.entry__freecompany__link').first().find('span').text();
                return spanText || "Character not found or not in a Free Company";
            } else {
                return "Error getting web content - Lodestone Community Finder CSS May Have Updated";
            }
        }
        catch (err) {
            console.error("Error getting Free Company:", err);
            return "Error";
        }
    }
}

// Used for Getting Based Web Content From Lodestone for Parsing
const GetWebContent = async (firstName: string, lastName: string) => {
        nameParameter = `${firstName}+${lastName}`;
        const fullURL = `${baseURL}${nameParameter}${endQueryURL}`;
            try {
                const response = await axios.get(fullURL);
                return response.data;
            } catch (error) {
                console.error("Error fetching web content:", error);
                return null;
            }
}

const isNullOrEmpty = (value: string): Promise<boolean>  => {
    return Promise.resolve(value === null || value === undefined || value === '');
}