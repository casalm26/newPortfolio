import PersonalFooter from "@/components/shared/PersonalFooter";

const Footer = ({ className }: { className?: string }) => {
  return <PersonalFooter className={className ?? ""} />;
};

export default Footer;
