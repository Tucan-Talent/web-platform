import { getSettings } from "@/modules/chat-support/constants/settings"
import { CHAT_STEPS, FlowBuilder } from "@/modules/chat-support/constants/steps"
import {
  themeOptionsMap,
  themeQuestionOptions,
  themes
} from "@/modules/chat-support/constants/themes"
import { useCallback, useEffect, useMemo } from "react"
import ChatBot, { ChatBotProvider, type Params } from "react-chatbotify"
import { styles } from "@/modules/chat-support/constants/styles"
import { useTenant } from "@/providers/tenant-provider"
import { getImageURL } from "@/utils/aws.utils"
import {
  chatFollowUpOptionsMap,
  followUpOptions,
  restartOptionsMap
} from "@/modules/chat-support/constants/map"
import { ChatMessageInfo } from "@/modules/chat-support/constants/chat"
import { EndChatButton } from "@/modules/chat-support/components/molecules/EndChatButton"
import useWebSocketChatClient from "@/modules/chat-support/hooks/useWebSocketChatClient"

export function ChatSupportButton() {
  // Chat Logo
  const { tenantData } = useTenant()
  const imageURL = useMemo(
    () =>
      getImageURL(
        tenantData?.logo !== ""
          ? tenantData?.logo
          : tenantData?.customFieldsOnDemand?.favicon
      ),
    [tenantData]
  )

  // WebSocket
  const { client, connect, streamChat, sendMessage } = useWebSocketChatClient()

  useEffect(() => {
    connect()

    const currentClient = client.current

    return () => {
      if (currentClient?.readyState === WebSocket.OPEN) {
        currentClient.close()
      }
    }
  }, [client, connect])

  // Chat Flow Functions
  const initStep = async (params: Params) => {
    try {
      if (!client.current) await params.injectMessage(ChatMessageInfo.ERROR)

      // Initiate the session
      sendMessage(ChatMessageInfo.INIT)

      const message = await streamChat()

      await params.injectMessage(message)
    } catch (error) {
      await params.injectMessage(ChatMessageInfo.ERROR)
    }
  }

  const loopStep = useCallback(
    async (params: Params) => {
      try {
        if (!client.current) await params.injectMessage(ChatMessageInfo.ERROR)
        if (params.userInput === chatFollowUpOptionsMap.commonTopics) {
          params.goToPath(CHAT_STEPS.THEME)

          return
        }

        sendMessage(params.userInput)

        const message = await streamChat()

        await params.injectMessage(message)
      } catch (error) {
        await params.injectMessage(ChatMessageInfo.ERROR)
      }
    },
    [client, sendMessage, streamChat]
  )

  const endStep = useCallback(
    async (params: Params) => {
      try {
        if (client.current?.readyState === WebSocket.OPEN) {
          client.current.close()
        }

        await params.injectMessage(ChatMessageInfo.END_INFO)
      } catch (error) {
        await params.injectMessage(ChatMessageInfo.ERROR)
      }
    },
    [client]
  )

  const selectThemeStep = async (params: Params) => {
    try {
      await params.injectMessage(ChatMessageInfo.COMMON_TOPICS)
    } catch (error) {
      await params.injectMessage(ChatMessageInfo.ERROR)
    }
  }

  const processThemeStep = async (params: Params) => {
    try {
      const data = params.userInput

      await params.injectMessage(
        `Here are some common questions related to <b>${data}</b>:`
      )
    } catch (error) {
      await params.injectMessage(ChatMessageInfo.ERROR)
    }
  }

  const llmFlow = new FlowBuilder()
    .chatbotInit(initStep, CHAT_STEPS.LOOP, followUpOptions)
    .chatbotLoop(
      loopStep,
      CHAT_STEPS.LOOP,
      followUpOptions,
      (params: Params) => <EndChatButton params={params} />
    )
    .chatbotEnd(endStep, CHAT_STEPS.INIT, Object.values(restartOptionsMap))
    .chatbotSelectTheme(
      selectThemeStep,
      CHAT_STEPS.PROCESS_THEME,
      Object.values(themeOptionsMap).map((theme) => theme.title),
      (params: Params) => <EndChatButton params={params} />
    )
    .chatbotProcessTheme(
      processThemeStep,
      CHAT_STEPS.LOOP,
      themeQuestionOptions,
      (params: Params) => <EndChatButton params={params} />
    )
    .build()

  return (
    <ChatBotProvider
      flow={llmFlow}
      settings={getSettings(imageURL)}
      styles={styles}
      themes={themes}
    >
      <ChatBot />
    </ChatBotProvider>
  )
}
