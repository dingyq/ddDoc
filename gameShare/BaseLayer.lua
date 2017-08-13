BaseLayer = class("BaseLayer", function()
	return cc.LayerColor:create(cc.c4b(255,255,255,0), winSize.width, winSize.height)
end)

function BaseLayer:create( csbPath )
	local rootLayer = nil
	if csbPath then
		rootLayer = self:loadFromCSB(csbPath)
	else
		rootLayer = self:new()
	end
	-- rootLayer:registerScriptHandler(function (event)
	-- 	rootLayer:onNodeEvent(event)
	-- end)

	return rootLayer
end

function BaseLayer:loadFromCSB( csbPath )
	return cc.CSLoader:createNode(csbPath)
end

-- function BaseLayer:onNodeEvent( event )
-- 	if "enter" == eventName then
--     elseif "exit" == eventName then 
--     elseif "enterTransitionFinish" == eventName then        
--     elseif "exitTransitionStart" == eventName then        
--     elseif "cleanup" == eventName then
--     end
-- end