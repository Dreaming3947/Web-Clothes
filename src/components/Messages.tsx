import { useState, useEffect, useRef } from 'react';
import { Send, Search, Image as ImageIcon, MoreVertical } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

const API_URL = 'http://127.0.0.1:8000/backend/api';

interface Thread {
  id: number;
  other_user_id: number;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  product_id: number | null;
  product_title: string | null;
  product_price: number | null;
  product_image: string | null;
}

interface Message {
  id: number;
  thread_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  message_type: string;
  price_offer: number | null;
  is_read: boolean;
  created_at: string;
  sender_name: string;
  sender_avatar: string | null;
}

export default function Messages() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (user) {
      fetchThreads();
    }
  }, [user]);

  useEffect(() => {
    if (selectedThreadId) {
      fetchMessages(selectedThreadId);
    }
  }, [selectedThreadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages.php`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.data) {
        setThreads(data.data);
        // Auto-select first thread if available
        if (data.data.length > 0 && !selectedThreadId) {
          setSelectedThreadId(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
      toast.error(language === 'vi' ? 'Không thể tải danh sách tin nhắn' : 'Failed to load conversations');
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
      if (data.success && data.data) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error(language === 'vi' ? 'Không thể tải tin nhắn' : 'Failed to load messages');
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !selectedThreadId || sending) return;

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          thread_id: selectedThreadId,
          message: messageText,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessageText('');
        // Refresh messages
        await fetchMessages(selectedThreadId);
        // Refresh threads to update last message
        await fetchThreads();
      } else {
        toast.error(data.message || (language === 'vi' ? 'Không thể gửi tin nhắn' : 'Failed to send message'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(language === 'vi' ? 'Không thể gửi tin nhắn' : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return language === 'vi' ? 'Vừa xong' : 'Just now';
    if (diffMins < 60) return `${diffMins} ${language === 'vi' ? 'phút trước' : 'min ago'}`;
    if (diffHours < 24) return `${diffHours} ${language === 'vi' ? 'giờ trước' : 'hours ago'}`;
    if (diffDays < 7) return `${diffDays} ${language === 'vi' ? 'ngày trước' : 'days ago'}`;
    
    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">{language === 'vi' ? 'Vui lòng đăng nhập để xem tin nhắn' : 'Please login to view messages'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <h1 className="text-3xl mb-8">{t('messages')}</h1>

      <div className="grid lg:grid-cols-3 gap-6" style={{ maxHeight: '70vh' }}>
        {/* Conversations List */}
        <Card className="lg:col-span-1 p-4 flex flex-col" style={{ height: '70vh', maxHeight: '700px' }}>
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
            {loading ? (
              <div className="text-center py-4 text-gray-500">
                {language === 'vi' ? 'Đang tải...' : 'Loading...'}
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {language === 'vi' ? 'Chưa có tin nhắn nào' : 'No messages yet'}
              </div>
            ) : (
              <div className="space-y-2">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedThreadId === thread.id
                        ? 'bg-purple-50 border-purple-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={thread.other_user_avatar || undefined} />
                        <AvatarFallback>{thread.other_user_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="truncate font-medium">{thread.other_user_name}</h3>
                          {thread.unread_count > 0 && (
                            <span className="size-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                              {thread.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{thread.last_message}</p>
                        {thread.product_id && (
                          <div className="flex items-center gap-2 mt-2">
                            <img 
                              src={thread.product_image || 'https://via.placeholder.com/100'} 
                              alt="" 
                              className="size-8 rounded object-cover" 
                            />
                            <span className="text-xs text-gray-500 truncate">{thread.product_title}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{formatTime(thread.last_message_at)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col" style={{ height: '70vh', maxHeight: '700px' }}>
          {selectedThread ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedThread.other_user_avatar || undefined} />
                    <AvatarFallback>{selectedThread.other_user_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedThread.other_user_name}</h3>
                    <p className="text-sm text-gray-600">{language === 'vi' ? 'Đang hoạt động' : 'Active now'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-5" />
                </Button>
              </div>

              {/* Product Info */}
              {selectedThread.product_id && (
                <div className="p-4 border-b bg-gray-50 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedThread.product_image || 'https://via.placeholder.com/100'} 
                      alt="" 
                      className="size-16 rounded-lg object-cover" 
                    />
                    <div className="flex-1">
                      <h4 className="mb-1 font-medium">{selectedThread.product_title}</h4>
                      <p className="text-purple-600 font-semibold">
                        {selectedThread.product_price?.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/products/${selectedThread.product_id}`}>
                        {language === 'vi' ? 'Xem' : 'View'}
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === Number(user?.id);
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isOwn
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwn ? 'text-purple-200' : 'text-gray-500'
                            }`}
                          >
                            {formatMessageTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t flex-shrink-0">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="size-5" />
                  </Button>
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={language === 'vi' ? 'Nhập tin nhắn...' : 'Type a message...'}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={sending}
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                    disabled={sending || !messageText.trim()}
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
