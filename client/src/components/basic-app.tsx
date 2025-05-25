import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BasicApp() {
  const [activeTab, setActiveTab] = React.useState("inventory");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">HomeoInvent</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="learn">Learning</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle>Medicine Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Your homeopathic medicine inventory will be shown here.</p>
                  <Button className="mt-4">Add Medicine</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="learn">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Access interactive learning resources about homeopathic remedies.</p>
                  <Button className="mt-4">Start Learning</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>View insights about your homeopathic medicine usage.</p>
                  <Button className="mt-4">View Reports</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}