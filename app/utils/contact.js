import config from '~/config.json';

export function getWhatsAppLink(message = "Hi Firdosh, I'd like to talk about a project.") {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
}
