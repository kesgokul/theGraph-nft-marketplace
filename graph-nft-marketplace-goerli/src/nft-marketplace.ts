import { Address, BigInt } from "@graphprotocol/graph-ts";
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

export function handleItemBought(event: ItemBoughtEvent): void {
  const id: string = getIdFromParams(
    event.params.tokenId,
    event.params.nftAddress
  );

  let activeItem = ActiveItem.load(id);
  let itemBought = ItemBought.load(id);

  if (!itemBought) {
    itemBought = new ItemBought(id);
  }

  itemBought.tokenId = event.params.tokenId;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.buyer = event.params.buyer;

  activeItem!.buyer = event.params.buyer;

  itemBought.save();
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  const id: string = getIdFromParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let itemListed = ItemListed.load(id);
  let activeItem = ActiveItem.load(id);

  if (!activeItem) {
    activeItem = new ActiveItem(id);
  }
  if (!itemListed) {
    itemListed = new ItemListed(id);
  }

  activeItem.nftAddress = event.params.nftAddress;
  itemListed.nftAddress = event.params.nftAddress;

  activeItem.tokenId = event.params.tokenId;
  itemListed.tokenId = event.params.tokenId;

  activeItem.seller = event.params.seller;
  itemListed.seller = event.params.seller;

  activeItem.price = event.params.price;
  itemListed.price = event.params.price;

  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  activeItem.save();
  itemListed.save();
}

export function handleListingCancelled(event: ListingCancelledEvent): void {
  const id: string = getIdFromParams(
    event.params.tokenId,
    event.params.nftAddress
  );

  let activeItem = ActiveItem.load(id);
  let listingCancelled = ListingCancelled.load(id);

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
