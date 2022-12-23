import {
  ItemBought as ItemBoughtEvent,
  ItemListed as ItemListedEvent,
  ListingCancelled as ListingCancelledEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ItemBought,
  ItemListed,
  ListingCancelled,
  ActiveItem,
} from "../generated/schema";
import { BigInt, Address } from "@graphprotocol/graph-ts";

export function handleItemBought(event: ItemBoughtEvent): void {
  // load the ItemBought using id
  let itemBought = ItemBought.load(
    getIdFromParams(event.params.tokenId, event.params.nftAddress)
  );
  // load the ActiveItem
  let activeItem = ActiveItem.load(
    getIdFromParams(event.params.tokenId, event.params.nftAddress)
  );
  //if no Item bought, create new and set buyer, tokenId, nftAddress
  if (!itemBought) {
    itemBought = new ItemBought(
      getIdFromParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemBought.buyer = event.params.buyer;
  itemBought.tokenId = event.params.tokenId;
  itemBought.nftAddress = event.params.nftAddress;
  activeItem!.buyer = event.params.buyer;

  itemBought.save();
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  // load Itemlisted in case the listing is being updated
  const id = getIdFromParams(event.params.tokenId, event.params.nftAddress);
  let itemListed = ItemListed.load(id);
  let activeItem = ActiveItem.load(id);

  if (!itemListed) {
    itemListed = new ItemListed(id);
  }
  if (!activeItem) {
    activeItem = new ActiveItem(id);
  }

  itemListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;

  itemListed.nftAddress = event.params.nftAddress;
  activeItem.nftAddress = event.params.nftAddress;

  itemListed.seller = event.params.seller;
  activeItem.seller = event.params.seller;

  itemListed.price = event.params.price;
  activeItem.price = event.params.price;

  itemListed.save();
  activeItem.save();
}

export function handleListingCancelled(event: ListingCancelledEvent): void {
  const id = getIdFromParams(event.params.tokenId, event.params.nftAddress);
  let listingCancelled = ListingCancelled.load(id);
  let activeItem = ActiveItem.load(id);

  if (!listingCancelled) {
    listingCancelled = new ListingCancelled(id);
  }

  listingCancelled.tokenId = event.params.tokenId;
  listingCancelled.nftAddress = event.params.nftAddress;
  listingCancelled.seller = event.params.seller;
  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );

  listingCancelled.save();
  activeItem!.save();
}

function getIdFromParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
