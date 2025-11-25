import { useState, useEffect } from 'react';
import { Send, Search, MoreVertical, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import type { User } from '../App';

const API_URL = 'http://127.0.0.1:8000/backend/api';

type MessagingPageProps = {
  user: User | null;
};

type Thread = {
  id: number;
  other_user_id: number;
  other_user_name: string;
  other_user_avatar: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  product_id?: number;
  product_title?: string;
  product_price?: number;
  product_image?: string;
};

type Message = {
  id: number;
  thread_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  message_type: 'text' | 'price_offer' | 'image' | 'system';
  price_offer?: number;
  is_read: boolean;
  created_at: string;
  sender_name: string;
  sender_avatar: string;
};

export function MessagingPage({ user }: MessagingPageProps) {
  const [selectedThread, setSelectedThread] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      fetchThreads();
    }
  }, [user]);

  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread);
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedThread);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedThread]);

  const fetchThreads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages.php`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setThreads(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (threadId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages.php?thread_id=${threadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedThread || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          thread_id: selectedThread,
          message: messageText,
          message_type: 'text',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessageText('');
        fetchMessages(selectedThread);
        fetchThreads(); // Update thread list with new last message
      } else {
        toast.error(data.message || 'Gửi tin nhắn thất bại');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gửi tin nhắn thất bại');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl mb-6">Tin nhắn</h1>

        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : (
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
                  {threads.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có tin nhắn nào
                    </div>
                  ) : (
                    threads.map((thread) => (
                      <button
                        key={thread.id}
                        onClick={() => setSelectedThread(thread.id)}
                        className={`w-full p-4 rounded-lg flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                          selectedThread === thread.id ? 'bg-blue-50 border-2 border-blue-600' : ''
                        }`}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={thread.other_user_avatar} />
                            <AvatarFallback>{thread.other_user_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                          {thread.unread_count > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                              {thread.unread_count}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <p className={thread.unread_count > 0 ? 'font-semibold' : 'text-gray-900'}>
                              {thread.other_user_name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(thread.last_message_at).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          {thread.product_title && (
                            <p className="text-xs text-purple-600 mb-1">
                              📦 {thread.product_title}
                            </p>
                          )}
                          <p className={`text-sm line-clamp-1 ${
                            thread.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'
                          }`}>
                            {thread.last_message || 'Chưa có tin nhắn'}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
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
                          src={threads.find(t => t.id === selectedThread)?.other_user_avatar}
                        />
                        <AvatarFallback>
                          {threads.find(t => t.id === selectedThread)?.other_user_name?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{threads.find(t => t.id === selectedThread)?.other_user_name}</p>
                        {threads.find(t => t.id === selectedThread)?.product_title && (
                          <p className="text-sm text-gray-600">
                            Về: {threads.find(t => t.id === selectedThread)?.product_title}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Chưa có tin nhắn nào
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isCurrentUser = message.sender_id === parseInt(user?.id || '0');
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={message.sender_avatar} />
                                  <AvatarFallback>{message.sender_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div
                                    className={`rounded-lg p-3 ${
                                      isCurrentUser
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                                  >
                                    {message.message_type === 'price_offer' ? (
                                      <div>
                                        <p className="text-sm opacity-80">Đề xuất giá:</p>
                                        <p className="text-lg font-semibold">
                                          {message.price_offer?.toLocaleString('vi-VN')}₫
                                        </p>
                                        <p className="text-sm mt-1">{message.message}</p>
                                      </div>
                                    ) : (
                                      <p>{message.message}</p>
                                    )}
                                  </div>
                                  <p className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                                    {new Date(message.created_at).toLocaleTimeString('vi-VN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                    {isCurrentUser && message.is_read && ' • Đã xem'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
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
                        disabled={sending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={sending || !messageText.trim()}
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
        )}
      </div>
    </div>
  );
}
