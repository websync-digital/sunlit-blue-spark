export const COMPANY_PHONE = "+2349017813274"; // Replace with your actual phone number
export const COMPANY_NAME = "Cworth Energy";

export const formatWhatsAppMessage = (productName: string, price: string | number) => {
    const formattedPrice = typeof price === 'number' ? `₦${price.toLocaleString()}` : price;
    return `Hello ${COMPANY_NAME}! 👋\n\nI'm interested in purchasing the *${productName}* priced at *${formattedPrice}*.\n\nKindly provide more information about this product.\n\nThank you! 🌟`;
};