import { useState } from 'react';
import { Send, Search, Image as ImageIcon, MoreVertical } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

export default function Messages() {
  const { language, t } = useLanguage();
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [messageText, setMessageText] = useState('');

  const conversations = [
    {
      id: '1',
      user: {
        name: 'Nguyen Van A',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      },
      lastMessage: language === 'vi' ? 'Sản phẩm còn không bạn?' : 'Is this still available?',
      time: '2 phút trước',
      unread: 2,
      product: {
        name: 'Áo khoác denim vintage',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100',
        price: 450000,
      },
    },
    {
      id: '2',
      user: {
        name: 'Tran Thi B',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      lastMessage: language === 'vi' ? 'Cảm ơn bạn!' : 'Thank you!',
      time: '1 giờ trước',
      unread: 0,
      product: {
        name: 'Túi xách Louis Vuitton',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100',
        price: 8500000,
      },
    },
    {
      id: '3',
      user: {
        name: 'Le Van C',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      },
      lastMessage: language === 'vi' ? 'Cho mình xem thêm ảnh được không?' : 'Can I see more photos?',
      time: '3 giờ trước',
      unread: 1,
      product: {
        name: 'Giày thể thao Nike',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
        price: 1200000,
      },
    },
  ];

  const messages = [
    {
      id: '1',
      senderId: '1',
      text: language === 'vi' ? 'Chào bạn! Sản phẩm còn không?' : 'Hi! Is this still available?',
      time: '10:30',
      isOwn: false,
    },
    {
      id: '2',
      senderId: 'me',
      text: language === 'vi' ? 'Dạ còn ạ, bạn quan tâm à?' : 'Yes, it is. Are you interested?',
      time: '10:32',
      isOwn: true,
    },
    {
      id: '3',
      senderId: '1',
      text: language === 'vi' ? 'Vậy giá có thương lượng được không bạn?' : 'Can we negotiate the price?',
      time: '10:35',
      isOwn: false,
    },
    {
      id: '4',
      senderId: 'me',
      text: language === 'vi' ? 'Giá này đã rất tốt rồi bạn ơi 😊' : 'This is already a great price 😊',
      time: '10:36',
      isOwn: true,
    },
  ];

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const handleSend = () => {
    if (!messageText.trim()) return;
    // Mock send message
    setMessageText('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">{t('messages')}</h1>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder={language === 'vi' ? 'Tìm kiếm cuộc trò chuyện...' : 'Search conversations...'}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-80px)]">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedConversation === conv.id
                      ? 'bg-purple-50 border-purple-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={conv.user.avatar} />
                      <AvatarFallback>{conv.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="truncate">{conv.user.name}</h3>
                        {conv.unread > 0 && (
                          <span className="size-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <img src={conv.product.image} alt="" className="size-8 rounded object-cover" />
                        <span className="text-xs text-gray-500 truncate">{conv.product.name}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConv.user.avatar} />
                    <AvatarFallback>{selectedConv.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>{selectedConv.user.name}</h3>
                    <p className="text-sm text-gray-600">{language === 'vi' ? 'Đang hoạt động' : 'Active now'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-5" />
                </Button>
              </div>

              {/* Product Info */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <img src={selectedConv.product.image} alt="" className="size-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="mb-1">{selectedConv.product.name}</h4>
                    <p className="text-purple-600">{selectedConv.product.price.toLocaleString('vi-VN')}₫</p>
                  </div>
                  <Button size="sm" variant="outline">
                    {language === 'vi' ? 'Xem' : 'View'}
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.isOwn
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.isOwn ? 'text-purple-200' : 'text-gray-500'
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="size-5" />
                  </Button>
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={language === 'vi' ? 'Nhập tin nhắn...' : 'Type a message...'}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Send className="size-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {language === 'vi' ? 'Chọn một cuộc trò chuyện để bắt đầu' : 'Select a conversation to start'}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
