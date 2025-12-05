import TurndownService from 'turndown';

const turndownService = new TurndownService();

export const convertHtmlToMarkdown = (html: string): string => {
    if (!html) return '';
    return turndownService.turndown(html);
};
