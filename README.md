# Attention:
This is not tested, because of issue with stucked synchronization

# UniswapV2 subgraph 

Tracks historical reserves every blocks of all trading pairs

## Request data

Use this deployment url to request data:
https://api.studio.thegraph.com/query/50868/uniswapv2/v0.0.4 

Example: 

        {  pair(id: "0xBf6a0418e31f90b60ae3d19c56a659ad8b2f4D18"){  
    Asset0 {  
	    id  
	    symbol   
	    decimals  
		}  
    Asset1 {  
	    id  
	    symbol  
	    decimals  
	    }  
    Blocks   
      }  
    }

