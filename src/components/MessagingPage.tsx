import { useState } from 'react';
import { Send, Search, MoreVertical, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { mockMessages } from '../lib/mockData';
import type { User } from '../App';

type MessagingPageProps = {
  user: User | null;
};

type Thread = {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
};

export function MessagingPage({ user }: MessagingPageProps) {
  const [selectedThread, setSelectedThread] = useState<string | null>('thread1');
  const [messageText, setMessageText] = useState('');

  // Mock threads
  const threads: Thread[] = [
    {
      id: 'thread1',
      otherUserId: '2',
      otherUserName: 'Nguyễn Thị B',
      otherUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      lastMessage: 'Áo thun Uniqlo ạ. Bạn có thể giảm giá được không?',
      lastMessageTime: new Date('2025-10-27T10:35:00'),
      unread: 2,
    },
    {
      id: 'thread2',
      otherUserId: '3',
      otherUserName: 'Trần Văn C',
      otherUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      lastMessage: 'Sản phẩm này còn bảo hành không bạn?',
      lastMessageTime: new Date('2025-10-28T14:20:00'),
      unread: 1,
    },
    {
      id: 'thread3',
      otherUserId: '4',
      otherUserName: 'Lê Thị D',
      otherUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
      lastMessage: 'Cảm ơn bạn nhé!',
      lastMessageTime: new Date('2025-10-26T16:45:00'),
      unread: 0,
    },
  ];

  const currentThreadMessages = mockMessages.filter(m => m.threadId === selectedThread);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // In a real app, this would send the message
    setMessageText('');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl mb-6">Tin nhắn</h1>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Threads List */}
          <Card className="lg:col-span-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Tìm kiếm tin nhắn..." className="pl-10" />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`w-full p-4 rounded-lg flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                      selectedThread === thread.id ? 'bg-blue-50 border-2 border-blue-600' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={thread.otherUserAvatar} />
                        <AvatarFallback>{thread.otherUserName[0]}</AvatarFallback>
                      </Avatar>
                      {thread.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                          {thread.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <p className={thread.unread > 0 ? '' : 'text-gray-900'}>
                          {thread.otherUserName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {thread.lastMessageTime.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className={`text-sm line-clamp-1 ${
                        thread.unread > 0 ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {thread.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Messages */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedThread ? (
              <>
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={threads.find(t => t.id === selectedThread)?.otherUserAvatar}
                      />
                      <AvatarFallback>
                        {threads.find(t => t.id === selectedThread)?.otherUserName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{threads.find(t => t.id === selectedThread)?.otherUserName}</p>
                      <p className="text-sm text-gray-600">Đang hoạt động</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentThreadMessages.map((message) => {
                      const isCurrentUser = message.senderId === user?.id || message.senderId === '1';
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderId}`}
                              />
                              <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div
                                className={`rounded-lg p-3 ${
                                  isCurrentUser
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p>{message.content}</p>
                              </div>
                              <p className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                                {message.timestamp.toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="Nhập tin nhắn..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Quick replies */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessageText('Sản phẩm còn hàng không ạ?')}
                    >
                      Còn hàng không?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessageText('Bạn có thể giảm giá được không?')}
                    >
                      Giảm giá?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessageText('Tôi muốn xem thêm hình ảnh')}
                    >
                      Xem thêm ảnh
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Chọn một cuộc trò chuyện để bắt đầu
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
