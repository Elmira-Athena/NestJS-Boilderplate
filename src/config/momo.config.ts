import { registerAs } from '@nestjs/config';

export default registerAs('momo_gateway', () => ({
  mm_host_name: process.env.MM_HOST_NAME,
  mm_port: parseInt(<string>process.env.MM_PORT),
  mm_partner_code: process.env.MM_PARTNER_CODE,
  mm_access_key: process.env.MM_ACCESS_KEY,
  mm_secret_key: process.env.MM_SECRET_KEY,
  mm_order_info: process.env.MM_ORDER_INFO,
  mm_redirect_url: process.env.MM_REDIRECT_URL,
  mm_ipn_url: process.env.MM_IPN_URL,
  mm_request_type: process.env.MM_REQUEST_TYPE,
}));
