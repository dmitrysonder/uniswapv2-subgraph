import { ethereum, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { PairCreated } from "../generated/UniswapV2Factory/UniswapV2Factory";
import { Pair, Asset, Factory, BlockData } from "../generated/schema";
import { UniswapV2Pair } from "../generated/templates";
import { UniswapV2Pair as UniswapV2PairAbi } from "../generated/UniswapV2Factory/UniswapV2Pair";
import { getTokenSymbol, getTokenDecimals, FACTORY_ADDRESS } from "./helpers";

export function handlePairCreated(event: PairCreated): void {
  UniswapV2Pair.create(event.params.pair);

  let factory = Factory.load(FACTORY_ADDRESS);
  if (factory === null) {
    factory = new Factory(FACTORY_ADDRESS);
    factory.pairs = [];
  }

  let pair = new Pair(event.params.pair.toHexString());
  factory.pairs.push(pair.id);
  let asset0 = Asset.load(event.params.token0.toHexString());
  let asset1 = Asset.load(event.params.token1.toHexString());

  if (asset0 === null) {
    asset0 = new Asset(event.params.token0.toHexString());
    asset0.symbol = getTokenSymbol(event.params.token0);
    asset0.decimals = getTokenDecimals(event.params.token0);
  }

  if (asset1 === null) {
    asset1 = new Asset(event.params.token1.toHexString());
    asset1.symbol = getTokenSymbol(event.params.token1);
    asset1.decimals = getTokenDecimals(event.params.token1);
  }

  pair.Asset0 = asset0.id;
  pair.Asset1 = asset1.id;
  pair.Blocks = [];
  factory.pairs.push(pair.id);
  asset0.save();
  asset1.save();
  factory.save();
  pair.save();
}

export function handleBlock(block: ethereum.Block): void {
  let factory = Factory.load(FACTORY_ADDRESS);
  if (factory === null) {
    factory = new Factory(FACTORY_ADDRESS);
    factory.pairs = [];
    factory.save();
  }

  const pairsCount = factory.pairs.length;
  for (let i = 0; i < pairsCount; i++) {
    let pair = Pair.load(factory.pairs[i]);
    if (pair !== null) {
      const blockData = new BlockData(block.number.toString() + pair.id.toString());
      blockData.blockNumber = block.number.toI32();
      blockData.timestamp = block.timestamp.toI32();
      blockData.pair = pair.id;
      const contract = UniswapV2PairAbi.bind(Address.fromString(pair.id));
      const reserves = contract.getReserves();
      blockData.reserve0 = BigDecimal.fromString(reserves.value0.toString());
      blockData.reserve1 = BigDecimal.fromString(reserves.value1.toString());
      blockData.save();
      pair.Blocks.push(blockData.id);
      pair.save();
    }
  }
}
