var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

//PRICE UPDATER ON VARIANT SWITCH
var productDataElement = document.getElementById('product-data');
var shopPriceFormat = productDataElement.getAttribute("shop-price-format");
var shopPriceFormatWithCurrency = productDataElement.getAttribute("shop-price-format-with-currency");
var withCurrency = document.getElementById('product-price-section-2');
var withCurrency2 = document.getElementById('product-price-section-1');

  if(withCurrency){
    withCurrency = withCurrency.getAttribute("addcurrency");
  }
  else{
    withCurrency2 = withCurrency2.getAttribute("addcurrency");
  }


function getTextFromHTML(htmlString) {
  var tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
}


var curFormat = withCurrency != null ? withCurrency : withCurrency2;  

var productVariantsList = JSON.parse(productDataElement.dataset.product).variants;


//Check if proces are the same for each variant... if so skip below replacement logic
var areAllPricesTheSame = productVariantsList.every(variant => variant.price === productVariantsList[0].price);
// console.log("Are all prices the same?: ", areAllPricesTheSame);

if(!areAllPricesTheSame){

var variantInput = document.getElementById('ultimate-selected-variant');
var variantObserver = new MutationObserver(function(mutationsList) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
      var variantValue = variantInput.value
      

      productVariantsList.forEach(variant => {
        if(variant.id == variantValue){

          var productPrice = document.getElementById('product-price-section-2')
          if(productPrice == null){
            productPrice = document.getElementById('product-price-section-1')
          }


          var newFormattedPrice = Shopify.formatMoney(variant.price, curFormat != null ? shopPriceFormatWithCurrency : shopPriceFormat);

          var currentPriceText = getTextFromHTML(productPrice.innerHTML);
          var newFormattedPriceText = getTextFromHTML(newFormattedPrice);

          // Check if the new price is different from the current price
          if (currentPriceText.trim() !== newFormattedPriceText.trim()) {
            productPrice.innerHTML = newFormattedPrice;

          }

                    
          if(variant.compare_at_price > 0){
          var productComparePrice = document.querySelector('.sale')
          productComparePrice.innerHTML = Shopify.formatMoney(variant.compare_at_price, curFormat != null ? shopPriceFormatWithCurrency : shopPriceFormat);
          }

          // New code to update mobile slider
          updateMobileSliderForVariant(variant);
          }
      })  
    }
  }
}
);

variantObserver.observe(variantInput, { attributes: true });
  
}

// Add new function to handle mobile slider updates
function updateMobileSliderForVariant(variant) {
  
  const mobileSlider = document.querySelector('.mobile-product-slider');
  
  if (!mobileSlider || mobileSlider.style.display === 'none') {
    return;
  }

  const productData = JSON.parse(productDataElement.dataset.product);
  
  const allMedia = productData.media;
  
  // Filter media for the selected variant
  const variantMedia = allMedia.filter(media => {
    const matches = media.alt && media.alt.toLowerCase().includes(variant.title.toLowerCase());
    
    return matches;
  });
  

  // If no specific variant media found, show all media
  const mediaToShow = variantMedia.length > 0 ? variantMedia : allMedia;

  // Get the slider container
  const sliderContainer = mobileSlider.querySelector('.slider-container');
  
  if (!sliderContainer) {
    return;
  }

  // Create new slides HTML
  const slidesHTML = mediaToShow.map(media => {
    const slideHTML = `
      <div class="slide">
        ${getMediaHTML(media)}
      </div>
    `;
    return slideHTML;
  }).join('');

  // Update slider content
  sliderContainer.innerHTML = slidesHTML;

  // Reset slider position
  sliderContainer.style.transform = 'translateX(0)';
  
  // Reinitialize slider if needed
  if (typeof updateSliderHeight === 'function') {
    setTimeout(() => {
      updateSliderHeight();
    }, 100);
  }
  
}

// Helper function to generate media HTML
function getMediaHTML(media) {
  
  let html;
  switch(media.media_type) {
    case 'image':
      html = `<img src="${media.src}" alt="${media.alt || ''}" loading="lazy">`;
      break;
    case 'video':
    case 'external_video':
      html = `<div class="media-video">${media.html}</div>`;
      break;
    case 'model':
      html = `<div class="media-model">${media.html}</div>`;
      break;
    default:
      html = `<img src="${media.src}" alt="${media.alt || ''}" loading="lazy">`;
  }
  
  return html;
}
