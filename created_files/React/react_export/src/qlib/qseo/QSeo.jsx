import { useEffect, useRef } from "react";

const QSeo = ({
    site_name,
    page_favicon,
    page_name,
    page_title,
    page_description,
    page_image,
    page_keyword,
}) => {
    const metaTagsRef = useRef([]);

    useEffect(() => {
        // Cleanup previous tags
        metaTagsRef.current.forEach((tag) => {
            if (tag && tag.parentNode) {
                tag.parentNode.removeChild(tag);
            }
        });
        metaTagsRef.current = [];

        // Update Title
        if (page_title) {
            document.title = page_title;
        }

        const head = document.head;
        const tagsToInsert = [];

        const createMeta = (name, content, attrName = "name") => {
            if (content) {
                const meta = document.createElement("meta");
                meta.setAttribute(attrName, name);
                meta.setAttribute("content", content);
                tagsToInsert.push(meta);
            }
        };

        const createLink = (rel, href) => {
            if (href) {
                const link = document.createElement("link");
                link.setAttribute("rel", rel);
                link.setAttribute("href", href);
                tagsToInsert.push(link);
            }
        };

        // Standard QSeo
        createMeta("description", page_description);
        createMeta("keywords", page_keyword);
        createLink("icon", page_favicon);

        // Open Graph / Facebook
        createMeta("og:type", "website", "property");
        createMeta("og:image", page_image, "property");
        createMeta("og:site_name", site_name, "property");

        // Original logic had both page_name and page_title mapping to og:title
        //if (page_name) createMeta("og:title", page_name, "property");
        if (page_title) createMeta("og:title", page_title, "property");

        createMeta("og:description", page_description, "property");

        // Twitter
        createMeta("twitter:card", "summary_large_image");
        createMeta("twitter:title", page_title);
        createMeta("twitter:description", page_description);
        createMeta("twitter:image", page_image);

        // Insert at the top of head
        // insert before the first child
        const firstChild = head.firstChild;
        tagsToInsert.forEach((tag) => {
            head.insertBefore(tag, firstChild);
            metaTagsRef.current.push(tag);
        });

        // Cleanup function for unmount
        return () => {
            metaTagsRef.current.forEach((tag) => {
                if (tag && tag.parentNode) {
                    tag.parentNode.removeChild(tag);
                }
            });
            metaTagsRef.current = [];
        };
    }, [
        site_name,
        page_favicon,
        page_name,
        page_title,
        page_description,
        page_image,
        page_keyword,
    ]);

    return null;
};

export default QSeo;
QSeo.displayName = "QSeo";
