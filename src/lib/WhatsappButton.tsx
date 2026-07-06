import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "8801700000000"; // Your number without + or spaces
  const message = encodeURIComponent("Hi! I'm interested in your services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
      <MessageCircle className="relative h-6 w-6 fill-white" />
    </a>
  );
};

export default WhatsAppButton;
