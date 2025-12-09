import TurndownService from 'turndown';

const turndownService = new TurndownService();

export const convertHtmlToMarkdown = (html: string): string => {
    if (!html) return '';
    return turndownService.turndown(html);
};

export const calculateNuvemshopPrice = (netValue: number): number => {
    // Preço Venda = (Valor Líquido + 0,35) / (1 - 4,99%)
    return (netValue + 0.35) / (1 - 0.0499);
};

export const calculateShopeePrice = (netValue: number): number => {
    // Modo Reverso:
    // Preço Venda = (Valor Líquido + 4,00) / (1 - 20%)
    let price = (netValue + 4.00) / 0.80;

    // Verifica se a comissão ultrapassaria R$ 105,00
    const commission = price * 0.20;

    if (commission > 105.00) {
        // Se ultrapassar, a fórmula muda para apenas somar os R$ 105,00 e a taxa fixa ao seu valor líquido.
        price = netValue + 105.00 + 4.00;
    }

    return price;
};

export const calculateElo7Price = (netValue: number): number => {
    // Faixas da Taxa de Serviço:
    // Até R$ 29,89: R$ 1,99
    // Até R$ 79,89: R$ 2,49
    // Até R$ 149,89: R$ 2,99
    // Até R$ 299,89: R$ 4,99
    // Acima de R$ 299,89: R$ 5,99

    // Preço Venda = (Valor Líquido + 6,00 + TaxaServiço) / (1 - 20%)

    const brackets = [
        { limit: 29.89, fee: 1.99 },
        { limit: 79.89, fee: 2.49 },
        { limit: 149.89, fee: 2.99 },
        { limit: 299.89, fee: 4.99 },
        { limit: Infinity, fee: 5.99 }
    ];

    for (const bracket of brackets) {
        const price = (netValue + 6.00 + bracket.fee) / 0.80;
        if (price <= bracket.limit) {
            return price;
        }
    }

    // Should not reach here given the Infinity limit, but as a fallback:
    return (netValue + 6.00 + 5.99) / 0.80;
};
