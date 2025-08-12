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
import { Trash2, Plus, RefreshCw, Settings, Rss, BarChart3, GripVertical, ArrowUp, ArrowDown, Star, TrendingUp, Edit, MoveUp, MoveDown, Target } from "lucide-react";
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

  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
    sortOrder: 0
  });
  
  // Advanced story placement controls
  const [editingRank, setEditingRank] = useState<{ articleId: string; currentRank: number } | null>(null);
  const [customRankScore, setCustomRankScore] = useState<number>(100);

  // Queries
  const { data: sources = [] } = useQuery<RssSource[]>({
    queryKey: ["/api/sources"],
  });

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles", { limit: 100 }],
  });

  const { data: categories = [] } = useQuery<{name: string, slug: string, description: string | null, isActive: boolean, id: string, sortOrder: number}[]>({
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

  // Category mutations
  const addCategoryMutation = useMutation({
    mutationFn: async (category: typeof newCategory) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error("Failed to add category");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Category added successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setNewCategory({ name: "", slug: "", description: "", isActive: true, sortOrder: 0 });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add category", variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Category deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    },
  });

  const toggleCategoryMutation = useMutation({
    mutationFn: async ({ categoryId, isActive }: { categoryId: string, isActive: boolean }) => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to update category");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Category updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
    },
  });

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.url) return;
    addSourceMutation.mutate(newSource);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) return;
    addCategoryMutation.mutate(newCategory);
  };

  // Auto-generate slug from name
  const handleCategoryNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setNewCategory({ ...newCategory, name, slug });
  };

  // Category reordering
  const reorderCategoryMutation = useMutation({
    mutationFn: async ({ categoryId, newSortOrder }: { categoryId: string, newSortOrder: number }) => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: newSortOrder }),
      });
      if (!response.ok) throw new Error("Failed to reorder category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reorder category", variant: "destructive" });
    },
  });

  const handleMoveCategory = (categoryId: string, direction: 'up' | 'down') => {
    const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = sortedCategories.findIndex(c => c.id === categoryId);
    
    if (currentIndex === -1) return;
    
    if (direction === 'up' && currentIndex > 0) {
      const targetCategory = sortedCategories[currentIndex - 1];
      reorderCategoryMutation.mutate({ 
        categoryId: categoryId, 
        newSortOrder: targetCategory.sortOrder 
      });
      reorderCategoryMutation.mutate({ 
        categoryId: targetCategory.id, 
        newSortOrder: sortedCategories[currentIndex].sortOrder 
      });
    } else if (direction === 'down' && currentIndex < sortedCategories.length - 1) {
      const targetCategory = sortedCategories[currentIndex + 1];
      reorderCategoryMutation.mutate({ 
        categoryId: categoryId, 
        newSortOrder: targetCategory.sortOrder 
      });
      reorderCategoryMutation.mutate({ 
        categoryId: targetCategory.id, 
        newSortOrder: sortedCategories[currentIndex].sortOrder 
      });
    }
  };

  // Article promotion mutations
  const promoteArticleMutation = useMutation({
    mutationFn: async ({ articleId, rankScore }: { articleId: string, rankScore: number }) => {
      const response = await fetch(`/api/articles/${articleId}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rankScore }),
      });
      if (!response.ok) throw new Error("Failed to promote article");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Article promoted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to promote article", variant: "destructive" });
    },
  });

  const unpromoteArticleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const response = await fetch(`/api/articles/${articleId}/promote`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to unpromote article");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Article unpromoted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to unpromote article", variant: "destructive" });
    },
  });

  // Advanced ranking controls
  const updateRankMutation = useMutation({
    mutationFn: async ({ articleId, rankScore }: { articleId: string, rankScore: number }) => {
      const response = await fetch(`/api/articles/${articleId}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rankScore }),
      });
      if (!response.ok) throw new Error("Failed to update rank");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Article rank updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setEditingRank(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update article rank", variant: "destructive" });
    },
  });

  const handleRankEdit = (articleId: string, currentRank: number) => {
    setEditingRank({ articleId, currentRank });
    setCustomRankScore(currentRank);
  };

  const handleRankUpdate = () => {
    if (editingRank) {
      updateRankMutation.mutate({ 
        articleId: editingRank.articleId, 
        rankScore: customRankScore 
      });
    }
  };

  const quickRank = (articleId: string, score: number) => {
    promoteArticleMutation.mutate({ articleId, rankScore: score });
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
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="categories" className="flex items-center gap-2">
              Categories
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
                    <div key={article.id} className="p-4 border rounded-lg bg-white relative">
                      {article.isPromoted && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="default" className="text-xs bg-yellow-500 text-black">
                            <Star size={12} className="mr-1" />
                            Promoted #{article.rankScore}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-2 pr-20">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{article.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">{article.excerpt}</p>
                          <div className="flex items-center gap-2 text-xs mb-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-gray-500">{article.source}</span>
                            {article.isLgbtqFocused && (
                              <Badge variant="secondary">LGBTQ+</Badge>
                            )}
                            <span className="text-gray-500">
                              {article.likes || 0} likes
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {/* Quick Promotion Buttons */}
                            {!article.isPromoted ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => quickRank(article.id, 500)}
                                  disabled={promoteArticleMutation.isPending}
                                  className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                                  data-testid={`button-urgent-${article.id}`}
                                >
                                  <Target size={12} className="mr-1" />
                                  Urgent
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => quickRank(article.id, 300)}
                                  disabled={promoteArticleMutation.isPending}
                                  className="bg-orange-600 hover:bg-orange-700 text-xs px-2 py-1"
                                  data-testid={`button-high-${article.id}`}
                                >
                                  <MoveUp size={12} className="mr-1" />
                                  High
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => quickRank(article.id, 100)}
                                  disabled={promoteArticleMutation.isPending}
                                  className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                                  data-testid={`button-featured-${article.id}`}
                                >
                                  <Star size={12} className="mr-1" />
                                  Featured
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRankEdit(article.id, article.rankScore)}
                                  disabled={updateRankMutation.isPending}
                                  className="text-xs px-2 py-1"
                                  data-testid={`button-edit-rank-${article.id}`}
                                >
                                  <Edit size={12} className="mr-1" />
                                  Edit Rank
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => unpromoteArticleMutation.mutate(article.id)}
                                  disabled={unpromoteArticleMutation.isPending}
                                  className="text-xs px-2 py-1"
                                  data-testid={`button-unpromote-${article.id}`}
                                >
                                  <Star size={12} className="mr-1" />
                                  Unpromote
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 flex-shrink-0">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Custom Rank Editor Modal */}
            {editingRank && (
              <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                  <CardHeader className="pb-4">
                    <CardTitle>Edit Article Rank</CardTitle>
                    <CardDescription>
                      Set a custom rank score for precise story placement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rank-score">Rank Score</Label>
                      <Input
                        id="rank-score"
                        type="number"
                        value={customRankScore}
                        onChange={(e) => setCustomRankScore(Number(e.target.value))}
                        min="1"
                        max="1000"
                        className="w-full"
                        data-testid="input-custom-rank"
                      />
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>500+:</strong> Breaking News / Urgent</div>
                        <div><strong>300-499:</strong> High Priority</div>
                        <div><strong>100-299:</strong> Featured Stories</div>
                        <div><strong>1-99:</strong> Standard Promoted</div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingRank(null)}
                        data-testid="button-cancel-rank"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleRankUpdate}
                        disabled={updateRankMutation.isPending}
                        data-testid="button-update-rank"
                      >
                        {updateRankMutation.isPending ? "Updating..." : "Update Rank"}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            {/* Add New Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus size={20} />
                  Add Category
                </CardTitle>
                <CardDescription>
                  Create a new category for organizing articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input
                        id="category-name"
                        placeholder="e.g., Sports"
                        value={newCategory.name}
                        onChange={(e) => handleCategoryNameChange(e.target.value)}
                        data-testid="input-category-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category-slug">Category Slug</Label>
                      <Input
                        id="category-slug"
                        placeholder="e.g., sports"
                        value={newCategory.slug}
                        onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                        data-testid="input-category-slug"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="category-description">Description</Label>
                      <Input
                        id="category-description"
                        placeholder="Brief description of this category"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        data-testid="input-category-description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category-sort-order">Sort Order</Label>
                      <Input
                        id="category-sort-order"
                        type="number"
                        placeholder="0"
                        value={newCategory.sortOrder}
                        onChange={(e) => setNewCategory({ ...newCategory, sortOrder: parseInt(e.target.value) || 0 })}
                        data-testid="input-category-sort-order"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="category-active"
                        checked={newCategory.isActive}
                        onCheckedChange={(checked) => setNewCategory({ ...newCategory, isActive: checked })}
                        data-testid="switch-category-active"
                      />
                      <Label htmlFor="category-active">Active</Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={addCategoryMutation.isPending}
                    data-testid="button-add-category"
                  >
                    {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Manage your article categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...categories].sort((a, b) => a.sortOrder - b.sortOrder).map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveCategory(category.id, 'up')}
                            disabled={index === 0 || reorderCategoryMutation.isPending}
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            data-testid={`button-move-up-${category.slug}`}
                          >
                            <ArrowUp size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveCategory(category.id, 'down')}
                            disabled={index === categories.length - 1 || reorderCategoryMutation.isPending}
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            data-testid={`button-move-down-${category.slug}`}
                          >
                            <ArrowDown size={12} />
                          </Button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400 font-mono w-6">#{category.sortOrder}</span>
                            <h3 className="font-semibold">{category.name}</h3>
                            {!category.isActive && (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Slug: {category.slug}</p>
                          {category.description && (
                            <p className="text-xs text-gray-500">{category.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={(checked) => 
                            toggleCategoryMutation.mutate({ 
                              categoryId: category.name, // Using name as ID since categories don't expose ID
                              isActive: checked 
                            })
                          }
                          disabled={toggleCategoryMutation.isPending}
                          data-testid={`switch-category-${category.slug}`}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCategoryMutation.mutate(category.name)}
                          disabled={deleteCategoryMutation.isPending || category.slug === 'all'}
                          data-testid={`button-delete-category-${category.slug}`}
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