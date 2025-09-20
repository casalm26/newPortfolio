import { KBarButton } from "@shipixen/pliny/search/KBarButton";
import { siteConfig } from "@/data/config/site.settings";
import { SearchIcon } from "lucide-react";
import { useVisualFeedback } from "@/lib/visual-feedback";

const SearchButton = () => {
  const feedback = useVisualFeedback();

  if (siteConfig.search) {
    return (
      <div
        onClick={() => feedback.click()}
        onMouseEnter={() => feedback.hover()}
      >
        <KBarButton aria-label="Search">
          <SearchIcon />
        </KBarButton>
      </div>
    );
  }
};

export default SearchButton;
