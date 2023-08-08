import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/UniswapV2Factory/ERC20";

export const FACTORY_ADDRESS = "0x20fAfD2B0Ba599416D75Eb54f48cda9812964f46";

export function getTokenSymbol(tokenAddress: Address): string {
  const contract = ERC20.bind(tokenAddress);

  let symbol = "";
  const result = contract.try_symbol();
  if (!result.reverted) {
    symbol = result.value;
  }

  return symbol;
}

export function getTokenDecimals(tokenAddress: Address): BigInt {
  const contract = ERC20.bind(tokenAddress);
  let decimals = null;
  const result = contract.try_decimals();
  if (!result.reverted) {
    decimals = result.value;
  }
  return BigInt.fromI32(decimals as i32);
}
