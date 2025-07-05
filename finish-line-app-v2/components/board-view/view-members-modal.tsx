"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  QrCode, 
  Copy, 
  Users, 
  Crown,
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { Board } from "@/types/boards";
import { UserProfile } from "@/types/user";
import { getUserProfiles, formatUserDisplayName } from "@/lib/supabase/users";
import { useToast } from "@/hooks/use-toast";

interface ViewMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  board: Board;
  currentUserId: string;
}

export function ViewMembersModal({ 
  open, 
  onOpenChange, 
  board, 
  currentUserId 
}: ViewMembersModalProps) {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [pendingMembers, setPendingMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const { toast } = useToast();

  const shareCode = board.b_code;
  const shareUrl = `${window.location.origin}/boards/${shareCode}`;

  useEffect(() => {
    const fetchMembers = async () => {
      if (!open) return;
      
      setLoading(true);
      try {
        // Fetch allowed users (active members)
        if (board.allowed_users.length > 0) {
          const allowedUserProfiles = await getUserProfiles(board.allowed_users);
          setMembers(allowedUserProfiles);
        }

        // Fetch pending users if any
        if (board.pending_users.length > 0) {
          const pendingUserProfiles = await getUserProfiles(board.pending_users);
          setPendingMembers(pendingUserProfiles);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast({
          title: "Error",
          description: "Failed to load members",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [open, board.allowed_users, board.pending_users, toast]);

  const copyShareCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      toast({
        title: "Copied!",
        description: "Share code copied to clipboard",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy share code",
        variant: "destructive"
      });
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied!",
        description: "Share URL copied to clipboard",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy share URL",
        variant: "destructive"
      });
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, you would send an email invitation
    // For now, we'll just show a success message
    toast({
      title: "Invitation Sent!",
      description: `Invitation sent to ${inviteEmail}`,
    });
    setInviteEmail("");
  };

  const handleViewQRCode = () => {
    setShowQRCode(true);
    // In a real implementation, you would generate or show a QR code
    toast({
      title: "QR Code",
      description: "QR code functionality would be implemented here",
    });
  };

  const isAdmin = board.admin === currentUserId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-1/2 max-w-none sm:max-w-none md:max-w-none lg:max-w-none xl:max-w-none max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Board Members
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Code Section */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Share Code</h3>
                  <div className="flex items-center justify-center gap-2">
                    <code className="bg-muted px-4 py-2 rounded-md text-2xl font-mono font-bold tracking-wider">
                      {shareCode}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyShareCode}
                      className="h-10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share this code with others to invite them to the board
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-60"
                    />
                    <Button onClick={handleSendInvitation}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleViewQRCode}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    View QR Code
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyShareUrl}
                    className="text-sm"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Copy Share URL
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Members List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Active Members ({members.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {formatUserDisplayName(member)}
                            </span>
                            {member.id === board.admin && (
                              <Badge variant="secondary" className="text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                            {member.id === currentUserId && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Active</span>
                      </div>
                    </div>
                  </Card>
                ))}

                {members.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active members found
                  </div>
                )}
              </div>
            )}

            {/* Pending Members */}
            {pendingMembers.length > 0 && (
              <>
                <div className="flex items-center justify-between pt-4">
                  <h3 className="text-lg font-semibold">
                    Pending Invitations ({pendingMembers.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  {pendingMembers.map((member) => (
                    <Card key={member.id} className="p-4 opacity-60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white font-medium">
                            {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium">
                              {formatUserDisplayName(member)}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-muted-foreground">Pending</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
