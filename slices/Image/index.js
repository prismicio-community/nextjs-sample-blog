import NextImage from "next/image";
import * as prismicH from "@prismicio/helpers";
import { PrismicRichText } from "@prismicio/react";

import { Bounded } from "../../components/Bounded";

const Image = ({ slice }) => {
  const image = slice.primary.image;

  return (
    <Bounded
      as="section"
      xSize={slice.variation === "wide" ? "widest" : "base"}
    >
      <figure className="grid grid-cols-1 gap-4">
        {prismicH.isFilled.image(image) && (
          <NextImage
            src={prismicH.asImageSrc(image, {
              w: undefined,
              h: undefined,
            })}
            alt={image.alt}
            width={image.dimensions.width}
            height={image.dimensions.height}
            layout="responsive"
          />
        )}
        {prismicH.isFilled.richText(slice.primary.caption) && (
          <figcaption className="text-center font-serif italic tracking-tight text-gray-500">
            <PrismicRichText field={slice.primary.caption} />
          </figcaption>
        )}
      </figure>
    </Bounded>
  );
};

export default Image;

