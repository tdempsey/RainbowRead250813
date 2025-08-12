import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, RefreshCw, Settings, Rss, BarChart3 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RssSource, Article } from "@shared/schema";

export default function AdminPanel() {
  const { toast } = useToast();
  const [newSource, setNewSource] = useState({
    name: "",
    url: "",
    category: "news",
    isLgbtqFocused: false,
    isActive: true
  });

  // Queries
  const { data: sources = [] } = useQuery<RssSource[]>({
    queryKey: ["/api/sources"],
  });

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles", { limit: 100 }],
  });

  const { data: categories = [] } = useQuery<{name: string, slug: string, description: string}[]>({
    queryKey: ["/api/categories"],
  });

  // Mutations
  const addSourceMutation = useMutation({
    mutationFn: async (source: typeof newSource) => {
      const response = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(source),
      });
      if (!response.ok) throw new Error("Failed to add source");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "RSS source added successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
      setNewSource({ name: "", url: "", category: "news", isLgbtqFocused: false, isActive: true });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add RSS source", variant: "destructive" });
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      const response = await fetch(`/api/sources/${sourceId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete source");
    },
    onSuccess: () => {
      toast({ title: "Success", description: "RSS source deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete RSS source", variant: "destructive" });
    },
  });

  const refreshFeedMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      const response = await fetch(`/api/sources/${sourceId}/refresh`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to refresh feed");
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Feed refreshed successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to refresh feed", variant: "destructive" });
    },
  });

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.url) return;
    addSourceMutation.mutate(newSource);
  };

  // Statistics
  const stats = {
    totalSources: sources.length,
    activeSources: sources.filter(s => s.isActive).length,
    totalArticles: articles.length,
    lgbtqArticles: articles.filter(a => a.isLgbtqFocused).length,
    categoryCounts: categories.map((cat) => ({
      name: cat.name,
      count: articles.filter(a => a.category === cat.slug).length
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-pride-indigo" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Rss size={16} />
              RSS Sources
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              Articles
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
                  <Rss className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSources}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeSources} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalArticles}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.lgbtqArticles} LGBTQ+ focused
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">LGBTQ+ Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalArticles > 0 ? Math.round((stats.lgbtqArticles / stats.totalArticles) * 100) : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.categoryCounts.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <Badge variant="secondary">{cat.count} articles</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RSS Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            {/* Add New Source */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus size={20} />
                  Add RSS Source
                </CardTitle>
                <CardDescription>
                  Add a new RSS feed to aggregate content from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSource} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Source Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Pink News"
                        value={newSource.name}
                        onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                        data-testid="input-source-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url">RSS URL</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com/feed.xml"
                        value={newSource.url}
                        onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                        data-testid="input-source-url"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Default Category</Label>
                      <Select 
                        value={newSource.category} 
                        onValueChange={(value) => setNewSource({ ...newSource, category: value })}
                      >
                        <SelectTrigger data-testid="select-source-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="politics">Politics</SelectItem>
                          <SelectItem value="culture">Culture</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="lgbtq-focused"
                          checked={newSource.isLgbtqFocused}
                          onCheckedChange={(checked) => setNewSource({ ...newSource, isLgbtqFocused: checked })}
                          data-testid="switch-lgbtq-focused"
                        />
                        <Label htmlFor="lgbtq-focused">LGBTQ+ Focused Source</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="active"
                          checked={newSource.isActive}
                          onCheckedChange={(checked) => setNewSource({ ...newSource, isActive: checked })}
                          data-testid="switch-active"
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={addSourceMutation.isPending}
                    data-testid="button-add-source"
                  >
                    {addSourceMutation.isPending ? "Adding..." : "Add Source"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sources List */}
            <Card>
              <CardHeader>
                <CardTitle>RSS Sources</CardTitle>
                <CardDescription>
                  Manage your RSS feed sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{source.name}</h3>
                          {source.isLgbtqFocused && (
                            <Badge variant="secondary">LGBTQ+ Focused</Badge>
                          )}
                          {!source.isActive && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{source.url}</p>
                        <p className="text-xs text-gray-500">Category: {source.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => refreshFeedMutation.mutate(source.id)}
                          disabled={refreshFeedMutation.isPending}
                          data-testid={`button-refresh-${source.id}`}
                        >
                          <RefreshCw size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSourceMutation.mutate(source.id)}
                          disabled={deleteSourceMutation.isPending}
                          data-testid={`button-delete-${source.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>
                  Latest articles from all RSS sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.slice(0, 10).map((article) => (
                    <div key={article.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{article.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">{article.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline">{article.category}</Badge>
                          <span className="text-gray-500">{article.source}</span>
                          {article.isLgbtqFocused && (
                            <Badge variant="secondary">LGBTQ+</Badge>
                          )}
                          <span className="text-gray-500">
                            {article.likes || 0} likes
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure RSS aggregation and content management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <h4 className="font-semibold mb-2">Current Configuration:</h4>
                  <ul className="space-y-1">
                    <li>• RSS feeds are fetched every 30 minutes</li>
                    <li>• NewsAPI integration runs every 2 hours</li>
                    <li>• LGBTQ+ content detection is automatic</li>
                    <li>• Articles are automatically categorized</li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Advanced Settings (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}