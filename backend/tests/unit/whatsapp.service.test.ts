import { buildWhatsAppUrl } from '../../src/services/whatsapp.service';

describe('WhatsApp service', () => {
  it('builds url with encoded message', () => {
    const url = buildWhatsAppUrl({
      customerName: 'Ada',
      customerPhone: '+2348000000000',
      address: 'Lagos',
      items: [{ product: 'p1' as any, name: 'Classic', qty: 2, price: 1000 }],
      totalAmount: 2000,
      paymentMethod: 'bank_transfer',
    } as any);
    expect(url).toContain('https://wa.me');
    expect(url).toContain('Ada');
  });
});


