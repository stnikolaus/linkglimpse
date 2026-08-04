import { Actor, log } from 'apify';
import { inspectUrls } from 'linkglimpse/core';
import { normalizeInput, renderReportPreview, toDatasetItem } from './lib.mjs';

await Actor.init();

try {
  const input = normalizeInput(await Actor.getInput());
  await Actor.setStatusMessage(`Auditing ${input.urls.length} URL${input.urls.length === 1 ? '' : 's'}`);
  const results = await inspectUrls(input.urls, {
    concurrency: input.concurrency,
    userAgent: 'LinkGlimpse-Apify/0.1',
  });
  const environment = Actor.getEnv();
  const datasetItems = [];

  for (let index = 0; index < results.length; index += 1) {
    const result = results[index];
    let preview;
    if (input.renderPreviews && result.success) {
      try {
        const rendered = await renderReportPreview(result.report, input.previewPlatform);
        const key = `preview-${String(index + 1).padStart(3, '0')}.png`;
        await Actor.setValue(key, rendered.png, { contentType: 'image/png' });
        preview = {
          key,
          imageUrl: environment.defaultKeyValueStoreId
            ? `https://api.apify.com/v2/key-value-stores/${environment.defaultKeyValueStoreId}/records/${key}`
            : null,
          platforms: rendered.platforms,
          width: rendered.width,
          height: rendered.height,
        };
      } catch (error) {
        log.warning(`Could not render preview for ${result.url}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    datasetItems.push(toDatasetItem(result, preview));
    await Actor.setStatusMessage(`Processed ${index + 1}/${results.length} URLs`);
  }

  await Actor.pushData(datasetItems);
  const succeeded = datasetItems.filter((item) => item.success).length;
  await Actor.setStatusMessage(`Completed ${succeeded}/${datasetItems.length} URL audits`, { isTerminal: true });
  await Actor.exit();
} catch (error) {
  await Actor.fail(error instanceof Error ? error.message : String(error));
}
