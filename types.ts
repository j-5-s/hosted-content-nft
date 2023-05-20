import type {AbiTypeToPrimitiveType} from 'abitype';

export type NFTMetadata = {
  name: string;
  image: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[]
}

export type NFTAttributes = {
  title: string;
  URL: string;
  Timestamp: string;
  'Image SHA 256': string;
  'Text SHA 256': string;
}

export type Address = AbiTypeToPrimitiveType<'address'>