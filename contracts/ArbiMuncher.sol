// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;


import { IERC20 } from "./interfaces/IERC20.sol";
import { IUniswapV2Router } from "./interfaces/camelot/IRouter.sol";
import { IGmxRouter } from "./interfaces/gmx/IGmxRouter.sol";
import { IGmxReader } from "./interfaces/gmx/IGmxReader.sol";
import "hardhat/console.sol";

contract ArbiMuncher {

    struct ContractAddress {
        address _GmxRouterAddress;
        address _GmxReaderAddress;
        address _GmxVaultAddress;
        address _CamelotRouterAddress;
    }

    address public owner;

    ContractAddress Add;

    constructor(
        address GmxRouterAddress,
        address GmxReaderAddress,
        address GmxVaultAddress,
        address CamelotRouterAddress
    ) {
        Add._GmxRouterAddress = GmxRouterAddress;
        Add._GmxReaderAddress = GmxReaderAddress;
        Add._GmxVaultAddress = GmxVaultAddress;
        Add._CamelotRouterAddress = CamelotRouterAddress;
        owner = msg.sender;
    }

    function swapUni(address _tokenIn, address _tokenOut, uint256 _amount) private returns (uint256) {
        IERC20(_tokenIn).approve(Add._CamelotRouterAddress, _amount);

        uint256 balance = IERC20(_tokenOut).balanceOf(address(this));

        address[] memory path;
        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        uint256 deadline = block.timestamp + 100;
        IUniswapV2Router(Add._CamelotRouterAddress).swapExactTokensForTokensSupportingFeeOnTransferTokens(
            _amount,
            0,
            path,
            address(this),
            owner,
            deadline
        );

        return IERC20(_tokenOut).balanceOf(address(this)) - balance;
    }

    function swapGmx(
        address _tokenIn,
        address _tokenOut,
        uint256 _amount
    ) private returns (uint256) {
        IERC20(_tokenIn).approve(Add._GmxRouterAddress, _amount);

        uint256 balance = IERC20(_tokenOut).balanceOf(address(this));

        address[] memory path;
        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        IGmxRouter(Add._GmxRouterAddress).swap(path, _amount, 1, address(this));

        return IERC20(_tokenOut).balanceOf(address(this)) - balance;        
    }

    function getAmountOutMin(
        address _tokenIn,
        address _tokenOut,
        uint256 _amount
    ) public view returns (uint256) {
        address[] memory path;
        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        uint256[] memory amountOutMins = IUniswapV2Router(Add._CamelotRouterAddress).getAmountsOut(
            _amount,
            path
        );
        return amountOutMins[path.length - 1];
    }    

    function getAmountOutMinGmx(
        address _tokenIn,
        address _tokenOut,
        uint256 _amount
    ) public view returns (uint256) {
        (uint256 out, ) = IGmxReader(Add._GmxReaderAddress)
            .getAmountOut(Add._GmxVaultAddress, _tokenIn, _tokenOut, _amount);

        return out;
    }

    function estimateTradeUniToGmx(
        address _tokenBase,
        address _tokenMiddle,
        uint256 _amountIn
    ) public view returns (uint256) {
        uint256 middleOut = getAmountOutMin(_tokenBase, _tokenMiddle, _amountIn);
        uint256 baseOut = getAmountOutMinGmx(
            _tokenMiddle,
            _tokenBase,
            middleOut
        );

        uint256 margin = baseOut > _amountIn ? baseOut - _amountIn : 0;
        return margin;
    }

    function estimateTradeGmxToUni(
        address _tokenBase,
        address _tokenMiddle,
        uint256 _amountIn
    ) public view returns (uint256) {
        uint256 middleOut = getAmountOutMinGmx(
            _tokenBase,
            _tokenMiddle,
            _amountIn
        );
        uint256 baseOut = getAmountOutMin(_tokenMiddle, _tokenBase, middleOut);

        uint256 margin = baseOut > _amountIn ? baseOut - _amountIn : 0;
        return margin;
    }

    function tradeGmxToUni(
        address _tokenBase,
        address _tokenMiddle,
        uint256 _amountBaseIn
    ) external {
        require(msg.sender == owner, "not allowed");

        uint256 amountMiddelOut = swapUni(_tokenBase, _tokenMiddle, _amountBaseIn);
        uint256 amountBaseOut = swapGmx(_tokenMiddle, _tokenBase, amountMiddelOut);

        require(amountBaseOut > _amountBaseIn, "no profit");
    }

    function tradeUniToGmx(
        address _tokenBase,
        address _tokenMiddle,
        uint256 _amountBaseIn
    ) external {
        require(msg.sender == owner, "not allowed");

        uint256 amountMiddleOut = swapGmx(_tokenBase, _tokenMiddle, _amountBaseIn);
        uint256 amountBaseOut = swapUni(_tokenMiddle, _tokenBase, amountMiddleOut);

        require(amountBaseOut > _amountBaseIn, "no profit");
    }

    function recoverEth() external {
        require(msg.sender == owner, "not allowed");
        payable(msg.sender).transfer(address(this).balance);
    }

    function recoverToken(address tokenAddress) private {
        IERC20 token = IERC20(tokenAddress);
        token.transfer(owner, token.balanceOf(address(this)));
    }

    function recoverTokens(address[] calldata _tokens) external {
        require(msg.sender == owner, "not allowed");
        for (uint256 i = 0; i < _tokens.length; i++) {
            recoverToken(_tokens[i]);
        }
    }
    


}