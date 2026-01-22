class BatchProcessor {
  async processPagesInBatches(pages, batchSize, processFn) {
    const results = [];
    const totalBatches = Math.ceil(pages.length / batchSize);

    for (let i = 0; i < pages.length; i += batchSize) {
      const batchNumber = Math.floor(i / batchSize) + 1;
      const batch = pages.slice(i, i + batchSize);

      try {
        const batchPromises = batch.map((page, index) => {
          const globalIndex = i + index;
          return processFn(page, globalIndex);
        });

        // Use Promise.allSettled for better error handling
        const batchResults = await Promise.allSettled(batchPromises);

        // Log results and handle failures
        batchResults.forEach((result, index) => {
          const globalIndex = i + index;
          const pageSlug = batch[index].cms_page_Slug;

          if (result.status === "fulfilled") {
            results.push(result.value);
          } else {
            console.error(
              `❌ Failed page ${globalIndex + 1}: ${pageSlug}`,
              result.reason
            );
            results.push({ error: result.reason, page: pageSlug });
          }
        });

        // Optional: Add a small delay between batches to prevent overwhelming the system
        if (i + batchSize < pages.length) {
          await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms delay
        }
      } catch (error) {
        console.error(`Error in batch ${batchNumber}:`, error);
        // Continue with next batch even if current batch fails
      }
    }

    const successful = Array.isArray(results)
      ? results.filter((r) => r && !r?.error).length
      : 0;
    const failed = Array.isArray(results)
      ? results.filter((r) => r && r?.error).length
      : 0;
    return results;
  }

  // Alternative: Sequential processing for maximum reliability
  async processPageSequentially(pages, delayMs = 300) {
    const results = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageId = page["cms_page_Id"];
      const slug = page["cms_page_Slug"];

      try {
        const result = await parserPageContentReact.parsePageContent(
          commonUtils.projectId,
          pageId,
          slug,
          `${reactProjectPath}/${commonUtils.projectId}/jsons`
        );

        results.push({ success: true, slug, pageId, result });

        // Add delay between pages to prevent overwhelming the system
        if (i < pages.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`❌ Failed page ${i + 1}: ${slug}`, error);
        results.push({ success: false, slug, pageId, error: error.message });

        // Continue with next page even if current one fails
      }
    }

    return results;
  }
}

module.exports = new BatchProcessor();
